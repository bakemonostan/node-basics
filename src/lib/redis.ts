/**
 * Redis client singleton for session storage and caching.
 * Uses ioredis for performance and reliability.
 *
 * @module lib/redis
 */
import { Redis } from "ioredis";

// Load Redis URL from environment (with fallback for local dev)
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

/**
 * Singleton Redis client instance.
 * Reused across the application to avoid connection leaks.
 */
export const redis = new Redis(REDIS_URL, {
  // Enable lazyConnect to defer connection until first use
  lazyConnect: true,
  // Retry strategy for transient network issues
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // retry every 50ms, max 2s
  },
});
