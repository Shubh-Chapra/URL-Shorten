const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for your URL shortening service',
    },
    servers: [
      {
        url: 'http://localhost:8080', // change if needed
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};


const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};

