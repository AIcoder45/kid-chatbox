# Caching

## Using Redis for Caching

**Installation**:
```bash
npm install redis
```

**Setup**:
```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.error('Redis error:', err));
```

**Benefits**: Fast in-memory storage, reduces database load.

## Response Caching

**Cache GET Endpoints**:
```javascript
const cacheMiddleware = async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await client.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Store original json method
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    client.setex(key, 300, JSON.stringify(data)); // 5 min cache
    return originalJson(data);
  };
  
  next();
};

router.get('/quizzes', cacheMiddleware, getQuizzes);
```

**Cache Key**: Include query parameters, user ID (if user-specific).

## Cache Invalidation Rules

**Invalidate on Updates**:
```javascript
// After creating/updating/deleting quiz
await client.del('cache:/api/quizzes');
await client.del(`cache:/api/quizzes/${quizId}`);
```

**Pattern-Based Invalidation**:
```javascript
// Delete all quiz-related cache
const keys = await client.keys('cache:/api/quizzes*');
if (keys.length > 0) {
  await client.del(keys);
}
```

**When to Invalidate**: On CREATE, UPDATE, DELETE operations.

## TTL Strategy

**Time-To-Live**:
- Frequently accessed: 5-15 minutes
- Rarely changed: 1-24 hours
- Static data: 24+ hours

**Set TTL**:
```javascript
client.setex(key, 300, value); // 5 minutes
```

**Benefits**: Automatic expiration, prevents stale data.

## Avoiding Stale Data

**Cache-Aside Pattern**:
1. Check cache
2. If miss, fetch from DB
3. Store in cache
4. Return data

**Write-Through**: Update cache when updating DB.

**Invalidation**: Always invalidate cache on data changes.

**User-Specific Data**: Include user ID in cache key to avoid cross-user data leaks.

