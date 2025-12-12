# Performance

## Async Patterns

**Use Async/Await**:
```javascript
// ✅ Good
async function getData() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

// ❌ Avoid: Callback hell
function getData(callback) {
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) return callback(err);
    callback(null, result.rows);
  });
}
```

**Parallel Operations**: Use `Promise.all()` for independent operations.

**Sequential Operations**: Use `for...of` loop for dependent operations.

## Streaming Responses

**Stream Large Datasets**:
```javascript
const { Transform } = require('stream');

router.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.write('[');
  
  const stream = pool.query('SELECT * FROM large_table').stream();
  stream.pipe(transformStream).pipe(res);
});
```

**Benefits**: Lower memory usage, faster initial response.

## Efficient Pagination

**Cursor-Based Pagination** (Better for large datasets):
```javascript
// Use WHERE id > lastId instead of OFFSET
const result = await pool.query(
  'SELECT * FROM items WHERE id > $1 ORDER BY id LIMIT $2',
  [lastId, limit]
);
```

**Offset Pagination** (Simple, but slow for large offsets):
```javascript
const result = await pool.query(
  'SELECT * FROM items ORDER BY id LIMIT $1 OFFSET $2',
  [limit, offset]
);
```

**Current Project**: Uses offset pagination. Consider cursor-based for large datasets.

## Avoiding Blocking Calls

**Non-Blocking Operations**:
- Use async/await for I/O operations
- Don't use synchronous file operations (`fs.readFileSync`)
- Use worker threads for CPU-intensive tasks

**Blocking Calls to Avoid**:
- `fs.readFileSync()`
- `JSON.parse()` on very large objects
- Synchronous crypto operations

## Memory Leak Detection

**Monitor Memory Usage**:
```javascript
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory:', {
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
  });
}, 60000);
```

**Common Causes**:
- Event listeners not removed
- Closures holding references
- Caching without limits

**Tools**: Use `clinic.js` or `node --inspect` for profiling.

