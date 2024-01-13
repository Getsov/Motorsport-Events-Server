const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Race Fanatic Documentation',
      version: '1.0.0',
      description: 'Description of your API',
    },
    servers: [
      {
        url: "http://localhost:3030/"
      },
    ],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  apis: ['./src/controllers/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;