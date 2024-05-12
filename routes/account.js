const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const { authenticateToken } = require("../middleware/auth"); // Ensure you have this file and function correctly set up

router.post("/createaccount", authenticateToken, async (req, res) => {
  const { accountType, balance, userId } = req.body;
  try {
    const account = await prisma.account.create({
      data: {
        accountType: accountType,
        balance: balance,
        userId: userId,
      },
    });
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({
      message: "Create Account Failed",
      error: error.message,
    });
  }
});

router.get("/getaccount", authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.status(200).json({
      message: "Get Account successfully",
      transactions, // Return all transactions
    });
  } catch (error) {
    res.status(500).json({
      message: "Get List Account Failed",
      error: error.message,
    });
  }
});

module.exports = router;

/**
 * @swagger
 * /account/createaccount:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Creates a new user account
 *     description: Creates a new account with the specified account type, balance, and user association.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *               - balance
 *               - userId
 *             properties:
 *               accountType:
 *                 type: string
 *                 example: 'Savings'
 *               balance:
 *                 type: number
 *                 example: 100000
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       500:
 *         description: Error occurred while creating the account.
 */

/**
 * @swagger
 * /account/getaccount:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieves all transactions
 *     description: Fetches a list of all transactions from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Get Account successfully'
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Unable to retrieve transactions due to a server error.
 */

/**
 * Components for Swagger documentation (to be added in your Swagger config file)
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *         userId:
 *           type: integer
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         accountId:
 *           type: integer
 */
