# Partitioning & Sharding (Advanced)

## When to Partition

**Consider Partitioning When**:
- Table size > 10GB
- Queries access only recent data
- Clear partitioning key (date, region)
- Maintenance operations are slow

**Benefits**: Faster queries, easier maintenance, better performance.

**Trade-offs**: More complex queries, planning required.

## Range vs Hash Partitioning

**Range Partitioning** (by date):
```sql
CREATE TABLE quiz_history (
  id UUID,
  created_at TIMESTAMP,
  ...
) PARTITION BY RANGE (created_at);

CREATE TABLE quiz_history_2024_01 PARTITION OF quiz_history
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Hash Partitioning** (by ID):
```sql
CREATE TABLE users (
  id UUID,
  ...
) PARTITION BY HASH (id);

CREATE TABLE users_0 PARTITION OF users FOR VALUES WITH (modulus 4, remainder 0);
```

**Use Range**: For time-series data, date-based queries.

**Use Hash**: For even distribution, no natural partition key.

## Performance Considerations

**Partition Pruning**: PostgreSQL automatically prunes partitions not needed.

**Indexes**: Create indexes on each partition, not parent table.

**Constraints**: Add CHECK constraints to partitions for better pruning.

**Query Performance**: Queries accessing single partition are faster.

**Maintenance**: Can drop old partitions easily.

## Horizontal Sharding Basics

**Sharding**: Distribute data across multiple databases.

**Sharding Key**: Choose key that distributes evenly (user_id, region).

**Application Logic**: Route queries to correct shard based on key.

**Challenges**:
- Cross-shard queries are complex
- Data rebalancing is difficult
- Transaction management across shards

**When to Shard**: Very large scale (millions of users, TBs of data).

**Current Project**: Not needed at current scale, plan for future if needed.

## Partitioning Example

**Time-Series Data**:
```sql
-- Partition quiz_history by month
CREATE TABLE quiz_history (
  id UUID,
  user_id UUID,
  created_at TIMESTAMP,
  ...
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE quiz_history_2024_01 PARTITION OF quiz_history
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Query automatically uses correct partition
SELECT * FROM quiz_history WHERE created_at >= '2024-01-15';
```

**Benefits**: Faster queries, easier archival (drop old partitions).

**Current Project**: Consider partitioning for large tables (quiz_history, analytics).

