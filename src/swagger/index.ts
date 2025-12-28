import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coupon System API',
      description: 'API documentation for the Coupon System',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    path.join(__dirname, '*.swagger.ts'), // Look for .swagger.ts files in this directory
    path.join(__dirname, '../routes/*.ts'), // Keep looking in routes if needed, or we can move all.
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
