const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});



// retrieve all accoun and transaction ref user 
router.get("/:userId", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.user.userId !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access this resource" });
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
      },
      include: {
        transactions: true, 
      },
    });

    console.log(accounts);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve accounts",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /user/{userId}/accounts:
 *   get:
 *     summary: Retrieves all accounts for a specific user
 *     description: This endpoint retrieves all accounts owned by the specified user along with their transactions.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to get accounts for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of accounts with their transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         accountType:
 *           type: string
 *         balance:
 *           type: number
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 */


module.exports = router;
