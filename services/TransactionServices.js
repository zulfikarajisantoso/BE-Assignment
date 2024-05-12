const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Transaction processing function
async function processTransaction(transaction) {
    return new Promise(async (resolve, reject) => {
        console.log('Transaction processing started for:', transaction);

        try {
            const createdTransaction = await prisma.transaction.create({
                data: {
                    amount: transaction.amount,
                    currency: transaction.currency,
                    toAddress: transaction.toAddress,
                    accountId: transaction.accountId,
                    status: "Pending"
                }
            });

            setTimeout(async () => {
                try {
                    const updatedTransaction = await prisma.transaction.update({
                        where: { id: createdTransaction.id },
                        data: { status: "Completed" }
                    });
                    console.log('Transaction processed for:', updatedTransaction);
                    resolve(updatedTransaction);
                } catch (error) {
                    console.error('Failed to update transaction:', error);
                    reject(error);
                }
            }, 5000);  // Simulating a delay
        } catch (error) {
            console.error('Transaction creation failed:', error);
            reject(error);
        }
    });
}

module.exports = {
    processTransaction
};
