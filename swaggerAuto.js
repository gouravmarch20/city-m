const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Neon Meme API',
    description: 'Auto-generated API docs',
  },
  host: 'localhost:4000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // Swagger scans all imported routes

swaggerAutogen(outputFile, endpointsFiles, doc);