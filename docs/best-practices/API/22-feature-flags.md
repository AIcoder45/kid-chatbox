# Feature Flags (Optional)

## Remote Config

**Use Feature Flag Service**:
- LaunchDarkly
- Unleash
- Custom solution with Redis/Database

**Implementation**:
```javascript
const featureFlags = {
  async isEnabled(flag, userId) {
    const result = await db.query(
      'SELECT enabled FROM feature_flags WHERE name = $1',
      [flag]
    );
    return result.rows[0]?.enabled || false;
  },
};

// Usage
if (await featureFlags.isEnabled('new-quiz-engine', user.id)) {
  return newQuizEngine.generate();
} else {
  return oldQuizEngine.generate();
}
```

**Benefits**: Toggle features without deployment.

## Safe Rollout

**Gradual Rollout**:
```javascript
async function isFeatureEnabled(flag, userId) {
  const config = await getFeatureFlag(flag);
  
  if (config.percentage) {
    // Percentage rollout
    return userId % 100 < config.percentage;
  }
  
  if (config.userIds) {
    // User whitelist
    return config.userIds.includes(userId);
  }
  
  return config.enabled;
}
```

**Stages**: 10% → 25% → 50% → 100%

**Monitor**: Watch error rates, performance metrics.

## Dark Launches

**Deploy Code, Don't Enable**:
- Deploy feature code
- Keep feature disabled
- Enable for internal testing
- Gradually enable for users

**Benefits**: Test in production environment, reduce risk.

## Feature Flag Best Practices

**Naming**: Use descriptive names (`new-payment-flow`, not `flag1`)

**Documentation**: Document what flag does, when to remove

**Cleanup**: Remove flags after feature is stable

**Default**: Default to `false` (disabled) for safety

**Testing**: Test both enabled and disabled states

## Current Project

**Consider Adding**: For gradual feature rollouts, A/B testing, emergency toggles.

**Simple Implementation**: Start with database table, expand to service later.

