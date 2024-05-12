const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Account Management API',
            version: '1.0.0',
            description: 'APIs to manage user accounts and transactions using Node.js, Express, and Prisma',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    // Path to the APIs are relative to the root of the application
    apis: ['./routes/*.js'], // Change this path as necessary
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
