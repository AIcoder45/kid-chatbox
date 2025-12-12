# Feature Flags

## Implementation Pattern

**Feature Flag Service**:
```typescript
const useFeatureFlag = (flag: string) => {
  const { user } = useAuth();
  return user?.features?.includes(flag) ?? false;
};
```

**Usage**:
```typescript
const { isNewUIEnabled } = useFeatureFlag('new-ui');

{isNewUIEnabled ? <NewComponent /> : <OldComponent />}
```

## Server-Side Flags

**Fetch from API**:
```typescript
const { data: flags } = useQuery(['feature-flags'], fetchFeatureFlags);

const isEnabled = flags?.includes('feature-name');
```

**Benefits**: Update without deployment, A/B testing.

## Environment-Based Flags

**Development Flags**:
```typescript
const isDevFeatureEnabled = import.meta.env.DEV && 
  import.meta.env.VITE_ENABLE_NEW_FEATURE === 'true';
```

**Use Cases**: Test features in development, gradual rollout.

## A/B Testing

**User Segmentation**:
```typescript
const variant = user.id % 2 === 0 ? 'A' : 'B';

{variant === 'A' ? <VariantA /> : <VariantB />}
```

**Track Results**: Log which variant users see, measure metrics.

## Gradual Rollout

**Percentage Rollout**:
```typescript
const rolloutPercentage = 25; // 25% of users
const isEnabled = user.id % 100 < rolloutPercentage;
```

**Increase Gradually**: 10% → 25% → 50% → 100%.

## Cleanup

**Remove Flags**: After feature is stable, remove flag checks.

**Documentation**: Document why flag exists and when to remove.

