// src/app.ts
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import { getHealth, getRoot } from "./controllers/auth.controller.js";
import authRoutes from "./routes/auth.route.js";

// Swagger setup
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Basic auth API with Express, Zod, and Prisma",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // paths to files with JSDoc
};

const specs = swaggerJsdoc(options);

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use("/docs-json", (_req, res) => res.json(specs));

  // Routes
  app.get("/", getRoot);
  app.get("/health", getHealth);
  app.use("/api/auth", authRoutes);

  app.use(errorHandler);
  return app;
};
