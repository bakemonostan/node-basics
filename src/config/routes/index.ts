// src/config/routes/index.ts

import { registerAuthRoutes } from "./auth.route.config.js";
// Import other route configs here as you add them
// import { registerProfileRoutes } from "./profile.route.config.js";
// import { registerPostRoutes } from "./post.route.config.js";

/**
 * Registers all OpenAPI route definitions
 * Call this before generating the OpenAPI spec
 */
export function registerAllRoutes() {
  registerAuthRoutes();
  // Register other routes here
  // registerProfileRoutes();
  // registerPostRoutes();
}
