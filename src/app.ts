// src/app.ts
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import { getHealth, getRoot } from "./controllers/auth.controller.js";
import authRoutes from "./routes/auth.route.js";
import { sessionMiddleware } from "./middleware/session.middleware.js";

// OpenAPI setup
import swaggerUi from "swagger-ui-express";
import { generateOpenAPISpec } from "./config/openapi.config.js";
import { registerAllRoutes } from "./config/routes/index.js";

// Register routes and generate OpenAPI specification
registerAllRoutes();
const openapiSpec = generateOpenAPISpec();

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(sessionMiddleware);
  // Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.use("/docs-json", (_req, res) => res.json(openapiSpec));

  // Routes
  app.get("/", getRoot);
  app.get("/health", getHealth);
  app.use("/api/auth", authRoutes);

  app.use(errorHandler);
  return app;
};
