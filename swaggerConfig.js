const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '"Race Fanatic" Documentation',
      version: '1.0.0',
      description:
        'This is a REST service, created for "Race Fanatic" APP.\
      To properly work the server needs MongoDB installed on the local machine for database. Add the connection string in the `index.js` file.\
      To build the server, run the following commands in the terminal: `npm install`, `npm start`.\
      ',
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-authorization',
          description: 'Add JSON Web Token (JWT) for authentication.',
        },
      },
    },
    security: [{ apiKey: [] }],
    servers: [
      {
        url: 'http://localhost:3030/',
        description: 'URL for tesing in the local environment.',
      },
      {
        url: 'https://race-fanatic-server.onrender.com/',
        description: 'URL for production environment.',
      },
    ],
  },
  apis: ['./src/controllers/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
