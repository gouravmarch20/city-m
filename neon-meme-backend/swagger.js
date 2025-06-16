const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Neon Meme Marketplace API",
      version: "1.0.0",
      description: "API documentation for the Neon Meme MERN app",
    },
    servers: [
      {
        url: "http://localhost:5001", // change this if using a different port
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files for Swagger comments
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
