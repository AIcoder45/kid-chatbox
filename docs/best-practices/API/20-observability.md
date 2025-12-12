# Observability

## Metrics (Prometheus Preferred)

**Install Prometheus Client**:
```bash
npm install prom-client
```

**Expose Metrics**:
```javascript
const client = require('prom-client');

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path, res.statusCode).observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

**Key Metrics**: Request rate, latency, error rate, database connections.

## Structured Logs

**Use Logging Library**:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info({
  message: 'User registered',
  userId: user.id,
  timestamp: new Date().toISOString(),
});
```

**Benefits**: Easy parsing, searching, analysis.

## Health Checks

**Health Endpoint**:
```javascript
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
  };
  
  // Check database connection
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
  }
  
  res.json(health);
});
```

**Use Cases**: Load balancer checks, monitoring alerts.

## Tracing (OpenTelemetry)

**Distributed Tracing**:
```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const tracer = trace.getTracer('kidchatbox-api');

async function processRequest(req, res, next) {
  const span = tracer.startSpan('process_request');
  // ... logic
  span.end();
}
```

**Benefits**: Track requests across services, identify bottlenecks.

**Current Project**: Consider adding for production monitoring.

## Monitoring Stack

**Recommended Stack**:
- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack or Loki
- **Tracing**: Jaeger or Zipkin
- **Alerts**: AlertManager or PagerDuty

**Set Up Alerts**: For errors, high latency, resource usage.

