# Project Structure

## Standard Folder Layout

```
server/
  config/          # Configuration files (database, app config)
  middleware/      # Express middleware (auth, validation, RBAC)
  routes/          # API route handlers
  services/        # Business logic layer (if using service pattern)
  models/          # Database models/schemas (if using ORM)
  utils/           # Utility functions (email, openai, etc.)
  scripts/         # Database migrations, seeders, utilities
  tests/           # Test files
  docs/            # Documentation
  index.js         # Application entry point
```

## Separation of Routes, Controllers, Services, Models

**Routes** (`server/routes/`):
- Define endpoints and HTTP methods
- Call controllers or services
- Handle request/response
- Apply middleware

**Controllers** (if used):
- Extract request data
- Validate input
- Call services
- Format responses

**Services** (`server/utils/` or `server/services/`):
- Business logic
- Database operations
- External API calls
- Data transformation

**Models** (if using ORM):
- Database schema definitions
- Data validation
- Relationships

## Using Modules Instead of Large Files

**Current Pattern**: Routes contain business logic.

**Better Pattern**: Extract logic to services/utils.

**Example**:
```javascript
// routes/auth.js
const authService = require('../services/authService');

router.post('/login', async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

// services/authService.js
async function login(credentials) {
  // Business logic here
}
```

**Benefits**: Easier testing, reusability, maintainability.

## File Size Guidelines

**Keep files under 300 lines**: Split large route files into smaller modules.

**Group related routes**: Use route modules (e.g., `admin.js`, `quiz.js`).

**Extract common logic**: Create shared utilities and services.

