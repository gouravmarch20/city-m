const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Neon Meme Marketplace API',
    description: 'API documentation for the Neon Meme MERN app',
  },
  host: 'localhost:5001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json'; // generated file
const endpointsFiles = ['./index.js']; // entry point to all routes

swaggerAutogen(outputFile, endpointsFiles, doc);