import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Options } from "swagger-jsdoc";

// Swagger options
const options: Options = {
  definition: {
    openapi: "3.0.0", // must be correct
    info: {
      title: "DevSync API",
      version: "1.0.0",
      description: "API documentation for DevSync Collaborative Coding Platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The user's unique ID.",
              example: "60d5ec49f13d8a0015b67d98"
            },
            email: {
              type: "string",
              description: "The user's email.",
              example: "user@example.com"
            },
            full_name: {
              type: "string",
              description: "The user's full name.",
              example: "John Doe"
            },
            avatar_url: {
              type: "string",
              description: "URL to the user's avatar.",
              nullable: true,
              example: "https://example.com/avatar.jpg"
            },
            is_active: {
              type: "boolean",
              description: "Whether the user account is active.",
              example: true
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          },
          required: ["_id", "email", "full_name", "is_active"]
        }
      }
    }
  },
  // Point to the controller and route files for JSDoc scanning
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

// Generate swagger specification
const swaggerSpec = swaggerJsdoc(options);

// Export a function to attach swagger to an Express app
export function setupSwagger(app: express.Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}