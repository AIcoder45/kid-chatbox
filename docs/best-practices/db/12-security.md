# Security

## Role-Based Access

**Create Application Roles**:
```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE app_readonly WITH LOGIN PASSWORD 'readonly_password';
```

**Grant Permissions**:
```sql
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT SELECT ON users TO app_readonly;
```

**Benefits**: Principle of least privilege, easier to audit.

**Current Project**: Uses single database user, consider role separation.

## Principle of Least Privilege

**Grant Minimum Required Permissions**:
- Read-only operations: `SELECT` only
- Write operations: `SELECT`, `INSERT`, `UPDATE` (no `DELETE` if not needed)
- Admin operations: Full access only when necessary

**Separate Users**:
- Application user: Limited permissions
- Migration user: DDL permissions
- Read-only user: SELECT only (for reporting)

**Current Project**: Review and limit database user permissions.

## Avoiding Superuser Roles

**Never Use `postgres` Superuser**:
- Use application-specific users
- Grant only required permissions
- Use superuser only for administration

**Risks**: Superuser can bypass all security, modify system catalogs.

**Best Practice**: Create dedicated users for each application/service.

## Parameterised Queries to Avoid SQL Injection

**Always Use Parameters**:
```javascript
// ✅ Safe
await pool.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ Vulnerable
await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

**Benefits**: Prevents SQL injection, allows query plan caching.

**Current Project**: Uses parameterized queries correctly.

## SSL/TLS Configuration

**Require SSL in Production**:
```javascript
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // For self-signed certs
    // Or provide CA certificate
    ca: fs.readFileSync('ca-certificate.crt'),
  },
});
```

**PostgreSQL Configuration**:
```sql
-- In postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

**Benefits**: Encrypts data in transit, prevents man-in-the-middle attacks.

**Current Project**: Uses SSL when `DATABASE_SSL=true`, ensure enabled in production.

## Security Checklist

**Before Production**:
- [ ] Use dedicated database users (not superuser)
- [ ] Grant minimum required permissions
- [ ] Enable SSL/TLS
- [ ] Use strong passwords
- [ ] Enable connection logging
- [ ] Review and limit network access
- [ ] Regular security audits

