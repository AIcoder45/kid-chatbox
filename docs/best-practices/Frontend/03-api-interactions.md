# API Interactions

## API Abstraction Layer

**Centralized Service** (`@/services/api.ts`):
- Single source for all API calls
- Consistent error handling
- Request/response interceptors
- Base URL configuration

**Service Structure**:
```typescript
export const api = {
  auth: authApi,
  quiz: quizApi,
  study: studyApi,
  admin: adminApi,
};
```

## Axios / Fetch Wrapper Guidelines

**Use Axios** (current project):
- Interceptors for auth tokens
- Request/response transformation
- Automatic JSON parsing
- Better error handling

**Wrapper Pattern**:
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

## Error and Retry Handling

**Error Types**:
- Network errors (retry with backoff)
- 4xx errors (client issue, don't retry)
- 5xx errors (server issue, retry)

**Retry Strategy**:
- Exponential backoff
- Max 3 retries
- User-friendly error messages

## Managing Loading States

**Pattern**:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T | null>(null);
```

**Use React Query** for automatic loading/error states.

## Handling Cancellations

**AbortController** for fetch:
```typescript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
// Cancel: controller.abort();
```

**Axios Cancellation**:
```typescript
const source = axios.CancelToken.source();
axios.get(url, { cancelToken: source.token });
// Cancel: source.cancel();
```

