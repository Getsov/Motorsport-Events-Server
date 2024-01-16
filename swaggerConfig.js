const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '"Race Fanatic" Documentation',
      version: '1.0.0',
      description: 'This is a REST service, created for "Race Fanatic" APP.\
      To properly work the server need installed mongoDB on local machine for database. Add the connection string in the `index.js` file.\
      To build the server, run the following commands in the terminal: `npm install`, `npm start`.\
      ',
    },
    servers: [
      {
        url: "http://localhost:3030/"
      },
    ]
  },
  apis: ['./src/controllers/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;