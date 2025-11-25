/**
 * Configures and returns Express session middleware backed by Redis.
 * Enforces HTTP-only, secure, SameSite=Lax cookies for security.
 *
 * Implements OWASP Session Management best practices:
 * - HTTP-only cookies (XSS protection)
 * - SameSite=Lax (CSRF protection)
 * - Secure flag (HTTPS enforcement in prod)
 * - Automatic expiration (7 days)
 *
 * @module middleware/session
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html}
 * @see {@link https://nodejsdp.link/session} Node.js Design Patterns Ch. 11: Advanced Recipes
 */
import session, { Store } from "express-session";
import { RedisStore } from "connect-redis"; // ✅ Named import (v9+)
import { redis } from "../lib/redis.js";

// Validate required environment variable in production
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production");
}

/**
 * Session configuration options.
 * @constant
 * @see {@link https://expressjs.com/en/resources/middleware/session.html}
 */
const SESSION_CONFIG = {
  store: new RedisStore({ client: redis }) as Store,
  secret: process.env.SESSION_SECRET || "fallback-dev-secret-not-secure",
  resave: false, // Avoids unnecessary Redis writes
  saveUninitialized: false, // Prevents empty session creation
  cookie: {
    httpOnly: true, // ✅ Blocks document.cookie access (XSS mitigation)
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in production
    sameSite: "lax" as const, // ✅ Mitigates CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Standard path
  },
} as const;

/**
 * Express middleware that enables server-side sessions with Redis.
 * Attaches `req.session` object to requests.
 *
 * @returns Express session middleware
 */
export const sessionMiddleware = session(SESSION_CONFIG);
