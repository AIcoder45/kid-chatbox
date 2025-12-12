# Validation

## Input Validation with Joi or Zod

**Installation**:
```bash
npm install joi
# or
npm install zod
```

**Joi Example**:
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).required(),
  age: Joi.number().integer().min(7).max(14).optional(),
});

router.post('/register', async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  // Use validated value
});
```

## Sanitising User Inputs

**Sanitize Before Validation**:
- Trim whitespace
- Remove HTML tags (if not needed)
- Normalize email addresses
- Escape special characters

**DOMPurify** (for HTML):
```javascript
const DOMPurify = require('isomorphic-dompurify');
const clean = DOMPurify.sanitize(userInput);
```

**Current Project**: Use existing sanitization framework in shared services.

## Reusable Validation Middleware

**Create Validation Middleware**:
```javascript
// middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    req.validatedData = value;
    next();
  };
};

// Usage
router.post('/register', validate(userSchema), async (req, res) => {
  // req.validatedData contains validated data
});
```

**Benefits**: DRY principle, consistent validation, reusable.

## Validation Rules

**Always Validate**:
- Request body (POST, PUT, PATCH)
- Query parameters (if critical)
- URL parameters (if used in queries)

**Validate Early**: Validate before processing to avoid unnecessary work.

**Return Clear Errors**: Provide specific error messages for each validation failure.

