# Database Connection Management

## Pool Usage

**Always Use Connection Pooling**:
```javascript
const pool = new Pool({
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Benefits**: Reuse connections, better performance, resource management.

**Current Project**: Uses connection pooling correctly.

## Pool Size Rules

**Formula**: `(cores * 2) + effective_spindle_count`

**General Guidelines**:
- Small apps: 5-10 connections
- Medium apps: 10-20 connections
- Large apps: 20-50 connections

**Don't Over-Pool**: Too many connections can degrade performance.

**Monitor**: Track pool usage, adjust based on load.

**Current Project**: Uses `max: 20` - appropriate for most applications.

## Detecting Slow Connections

**Monitor Connection Time**:
```javascript
const start = Date.now();
const client = await pool.connect();
const connectTime = Date.now() - start;
if (connectTime > 1000) {
  console.warn('Slow database connection:', connectTime);
}
client.release();
```

**Check Network Latency**: Use `pg_stat_activity` to see connection times.

**Common Causes**: Network issues, database overload, firewall rules.

## Releasing Connections Correctly

**Always Release**:
```javascript
const client = await pool.connect();
try {
  // Use client
} finally {
  client.release(); // Always release
}
```

**Use Pool.query()**: Automatically manages connections:
```javascript
// ✅ Good: Auto-managed
await pool.query('SELECT * FROM users');

// ⚠️ Manual: Must release
const client = await pool.connect();
try {
  await client.query('SELECT * FROM users');
} finally {
  client.release();
}
```

**Current Project**: Uses `pool.query()` correctly, manual connections in migrations properly released.

## Connection Pool Monitoring

**Monitor Pool Stats**:
```javascript
console.log('Pool stats:', {
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
});
```

**Set Up Alerts**: Alert if `waitingCount` is consistently high (indicates pool exhaustion).

**Tune Based on Metrics**: Adjust `max` based on actual usage patterns.

