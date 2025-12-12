# Deployment Practices

## Zero-Downtime Deployment

**Blue-Green Deployment**:
- Run two identical environments
- Deploy to inactive environment
- Switch traffic when ready
- Keep old environment as rollback

**Rolling Deployment**:
- Deploy to subset of servers
- Gradually shift traffic
- Monitor for issues

**Current Project**: Uses PM2. Consider zero-downtime restart.

## Rollbacks

**Quick Rollback Strategy**:
- Keep previous version available
- Database migrations should be reversible
- Feature flags for gradual rollback

**PM2 Rollback**:
```bash
pm2 restart ecosystem.config.js --update-env
# If issues, revert to previous version
```

**Database Rollbacks**: Create down migrations for all up migrations.

## Environment Parity

**Keep Environments Similar**:
- Development
- Staging (mirrors production)
- Production

**Differences Only**:
- Environment variables
- Database size/data
- External service endpoints

**Benefits**: Fewer surprises, easier debugging.

## Using PM2 or Containers

**PM2** (Current Project Uses):
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'kidchatbox-api',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
```

**Docker** (Alternative):
- Containerize application
- Use Docker Compose for local dev
- Deploy containers in production

**Benefits**: Consistent environments, easier scaling.

## Deployment Checklist

**Pre-Deployment**:
- [ ] All tests pass
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Backup database
- [ ] Health checks configured

**Post-Deployment**:
- [ ] Verify health endpoint
- [ ] Test critical endpoints
- [ ] Monitor logs
- [ ] Check error rates

