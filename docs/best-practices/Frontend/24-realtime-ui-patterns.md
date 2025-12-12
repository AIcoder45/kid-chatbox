# Real-Time UI Patterns

## WebSocket Connection

**Setup**:
```typescript
const ws = new WebSocket('wss://api.example.com');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI
};

ws.onerror = (error) => {
  // Handle error
};

ws.onclose = () => {
  // Reconnect logic
};
```

**Reconnection**: Implement exponential backoff for reconnection.

## Server-Sent Events (SSE)

**Implementation**:
```typescript
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI
};

eventSource.onerror = () => {
  // Handle error, reconnect
};
```

**Use Cases**: One-way updates from server (notifications, updates).

## Optimistic Updates

**Pattern**:
```typescript
// Update UI immediately
setData(newData);

// Send request
try {
  await updateData(newData);
} catch (error) {
  // Rollback on error
  setData(oldData);
  showError('Update failed');
}
```

**Benefits**: Perceived faster response, better UX.

## Live Data Updates

**Real-Time Dashboards**:
- Update metrics automatically
- Show "live" indicator
- Allow pause/resume

**Chat/Messaging**:
- Instant message delivery
- Typing indicators
- Online status

## Connection Status

**Show Connection Status**:
```typescript
const [isConnected, setIsConnected] = useState(false);

// Update based on WebSocket/SSE connection state
```

**UI Feedback**: Show indicator when disconnected, queue actions.

**Reconnection**: Automatic reconnection with user notification.

