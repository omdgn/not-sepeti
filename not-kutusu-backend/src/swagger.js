// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Not Kutusu API",
      version: "1.0.0",
      description: "Üniversite not paylaşım platformu için API dökümantasyonu"
    },
    servers: [{ url: "http://localhost:5050/api" }]
  },
  apis: ["./src/docs/swaggerDefinitions.js"],  // sadece tek dosyadan okur
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
