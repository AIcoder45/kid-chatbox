# High Availability & Replication

## Read Replicas

**Setup Streaming Replication**:
```sql
-- On primary
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET hot_standby = on;

-- On replica
primary_conninfo = 'host=primary.example.com port=5432 user=replicator'
```

**Benefits**: Distribute read load, improve performance, disaster recovery.

**Use Cases**: Read-heavy applications, reporting, analytics.

## Failover Design

**Automatic Failover**:
- Use tools: Patroni, repmgr, pg_auto_failover
- Monitor primary health
- Promote replica automatically
- Update application connection strings

**Manual Failover**:
```sql
-- On replica
SELECT pg_promote();
```

**Test Regularly**: Test failover procedures quarterly.

## Load Distribution

**Route Reads to Replicas**:
```javascript
const readPool = new Pool({
  host: process.env.DB_REPLICA_HOST,
});

const writePool = new Pool({
  host: process.env.DB_PRIMARY_HOST,
});

// Use readPool for SELECT queries
// Use writePool for INSERT/UPDATE/DELETE
```

**Application Logic**: Route queries based on operation type.

**Current Project**: Single database, consider read replicas as scale.

## Monitoring Replication Lag

**Check Lag**:
```sql
SELECT 
  client_addr,
  state,
  sync_state,
  pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS replication_lag_bytes
FROM pg_stat_replication;
```

**Alert Threshold**: Alert if lag > 1GB or > 1 minute.

**Causes**: Network issues, replica overload, large transactions.

**Current Project**: Single database, monitor replication lag when replicas added.

## Replication Best Practices

**Before Setup**:
- [ ] Plan replication topology
- [ ] Choose replication tool (Patroni, repmgr, etc.)
- [ ] Set up monitoring
- [ ] Test failover procedures
- [ ] Document failover process
- [ ] Configure automatic failover (if needed)

**For Current Project**: Plan for future scaling, not immediately required.

## High Availability Checklist

**Production Requirements**:
- [ ] Primary database with replication
- [ ] Automated failover (or documented manual process)
- [ ] Monitoring and alerting
- [ ] Regular failover testing
- [ ] Backup and restore procedures
- [ ] Disaster recovery plan

