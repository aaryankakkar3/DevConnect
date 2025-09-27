# DevConnect - Redis Cache Setup

## Redis Configuration

To enable user data caching, you need to set up Redis environment variables:

```env
# Redis Configuration (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

## Getting Upstash Redis Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token from the database details
4. Add them to your `.env.local` file

## Benefits

- **Faster User Data Loading**: ~5ms cache hits vs ~200ms database queries
- **Reduced Database Load**: Fewer connections to your main database
- **Better Performance**: User data is cached for 1 hour after first load
- **Automatic Fallback**: If Redis is unavailable, falls back to direct database queries

## Cache Behavior

- **Server-side**: Redis cache (1 hour TTL)
- **Client-side**: In-memory cache (5 minutes TTL)
- **Cache Clear**: Automatically cleared on user logout or profile updates
