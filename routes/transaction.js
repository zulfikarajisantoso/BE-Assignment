const express = require("express");
const router = express.Router();
const { processTransaction } = require("../services/TransactionServices");
const { authenticateToken } = require("../middleware/auth"); // Ensure you have this file and function correctly set up
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/createtransction", authenticateToken, async (req, res) => {
  const { amount, currency, accountId, toAddress } = req.body;
  try {
    const transaction = await processTransaction({
      amount,
      currency,
      accountId,
      toAddress,
    });
    res.status(200).json({
      message: "Transaction processed successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Create Transaction Failed",
      error: error.message,
    });
  }
});

router.get("/gettransaction", authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.status(200).json({
      message: "Get Transaction successfully",
      transactions, // Return all transactions
    });
  } catch (error) {
    res.status(500).json({
      message: "Get Transaction Failed",
      error: error.message,
    });
  }
});



module.exports = router;


/**
 * @swagger
 * /transaction/createtransaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new transaction
 *     description: Submits a new transaction to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - accountId
 *               - toAddress
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500
 *               currency:
 *                 type: string
 *                 example: 'USD'
 *               accountId:
 *                 type: integer
 *                 example: 1
 *               toAddress:
 *                 type: string
 *                 example: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
 *     responses:
 *       200:
 *         description: Transaction created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Transaction processed successfully'
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Failed to create the transaction.
 */


/**
 * @swagger
 * /transaction/gettransaction:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all transactions
 *     description: Fetches all transactions from the database.
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
 *                   example: 'Get Transaction successfully'
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Failed to retrieve transactions.
 */
