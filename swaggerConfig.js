const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My documentation - custom',
      version: '1.0.0',
      description: 'Description of your API',
    },
    servers: [
      {
        url: "HTTP"
      },
    ]
  },
  apis: ['./src/controllers/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
