import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Title',
    version: '1.0.0',
    description: 'API documentation for the application',
  },
  servers: [
    {
      url: 'http://localhost:3001', // Your API base URL (change it for production)
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Points to your route files for documentation
};

export const swaggerSpecs = swaggerJsdoc(options);
