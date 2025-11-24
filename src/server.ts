import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * Starts the HTTP server.
 * In production, this would include:
 *   - Graceful shutdown handling
 *   - Logger initialization
 *   - Error boundary setup
 */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
