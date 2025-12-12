# Offline Support / PWA

## Service Worker Setup

**Register Service Worker**:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Cache Strategy**:
- Cache-first for static assets
- Network-first for API calls
- Stale-while-revalidate for content

## Manifest File

**web.appmanifest**:
```json
{
  "name": "KidChatbox",
  "short_name": "KidChat",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3182ce",
  "background_color": "#ffffff",
  "icons": [...]
}
```

**Benefits**: Installable app, app-like experience.

## Offline Detection

**Online/Offline Events**:
```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

**UI Feedback**: Show offline indicator when disconnected.

## Caching Strategy

**Cache API Responses**:
- Cache GET requests
- Store in IndexedDB for complex data
- Sync when back online

**Background Sync**: Queue actions when offline, sync when online.

