const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Placeholder for routers
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transaction');
const accountRouter = require('./routes/account');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/users', usersRouter);
app.use('/transaction', transactionsRouter);
app.use('/account', accountRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
