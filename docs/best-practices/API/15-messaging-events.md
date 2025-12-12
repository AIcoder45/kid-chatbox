# Messaging & Events

## Event-Driven Design Basics

**Decouple Components**: Services communicate via events, not direct calls.

**Benefits**:
- Loose coupling
- Scalability
- Easier to add new features

**Example**:
```javascript
// Emit event
eventEmitter.emit('user.registered', { userId: user.id });

// Listen for event
eventEmitter.on('user.registered', async (data) => {
  await sendWelcomeEmail(data.userId);
  await assignDefaultPlan(data.userId);
});
```

## Using Pub/Sub

**Redis Pub/Sub**:
```javascript
const redis = require('redis');
const publisher = redis.createClient();
const subscriber = redis.createClient();

// Publish
await publisher.publish('user:registered', JSON.stringify({ userId: 123 }));

// Subscribe
subscriber.subscribe('user:registered');
subscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);
  handleUserRegistered(data);
});
```

**Benefits**: Works across multiple server instances.

## Handling Idempotent Consumers

**Idempotency**: Processing same event multiple times produces same result.

**Implementation**:
```javascript
const processedEvents = new Set();

async function handleEvent(eventId, eventData) {
  if (processedEvents.has(eventId)) {
    return; // Already processed
  }
  
  // Process event
  await processEvent(eventData);
  
  // Mark as processed
  processedEvents.add(eventId);
  
  // Store in database for persistence
  await db.query('INSERT INTO processed_events (id) VALUES ($1)', [eventId]);
}
```

**Why Important**: Network issues, retries can cause duplicate events.

**Storage**: Use database to track processed events (survives restarts).

## Event Schema

**Structured Events**:
```javascript
{
  id: 'uuid',
  type: 'user.registered',
  timestamp: '2024-01-01T00:00:00Z',
  data: { userId: 123 },
  version: 1,
}
```

**Versioning**: Include version for schema evolution.

**Current Project**: Uses `eventTracker` utility. Consider expanding for event-driven architecture.

