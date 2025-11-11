import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface CachedUserData {
  username: string;
  clearance: string;
  profilePicture: string;
  tokenCount?: number;
  verificationStatus?: string;
}

/**
 * Get cached user data from Redis
 * @param userId - The user ID to fetch data for
 * @returns Cached user data or null if not found
 */
export async function getCachedUserData(
  userId: string
): Promise<CachedUserData | null> {
  try {
    const cached = await redis.get(`user:${userId}`);
    return cached as CachedUserData | null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

/**
 * Set cached user data in Redis
 * @param userId - The user ID to cache data for
 * @param data - The user data to cache
 */
export async function setCachedUserData(
  userId: string,
  data: CachedUserData
): Promise<void> {
  try {
    // Cache for 1 hour (3600 seconds)
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(data));
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

/**
 * Clear cached user data from Redis
 * @param userId - The user ID to clear cache for
 */
export async function clearCachedUserData(userId: string): Promise<void> {
  try {
    await redis.del(`user:${userId}`);
  } catch (error) {
    console.error("Redis delete error:", error);
  }
}

/**
 * Check if Redis is available
 * @returns true if Redis is reachable, false otherwise
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error("Redis ping error:", error);
    return false;
  }
}
