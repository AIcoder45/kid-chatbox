# API Documentation

## Swagger / OpenAPI Rules

**Install Swagger**:
```bash
npm install swagger-ui-express swagger-jsdoc
```

**Setup**:
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KidChatbox API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Document Endpoints**:
```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
```

## Keeping Docs in Sync

**Document as You Code**: Write Swagger comments alongside route definitions.

**Review Process**: Include API docs review in PR process.

**Version Control**: Keep docs in same repo as code.

**Automated Checks**: Validate OpenAPI schema in CI.

## Auto-Generating Schemas

**From Joi/Zod Schemas**:
```javascript
const joiToSwagger = require('joi-to-swagger');

const userSchema = Joi.object({...});
const swaggerSchema = joiToSwagger(userSchema).swagger;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       ...
 */
```

**Benefits**: Single source of truth, automatic updates.

## Documentation Best Practices

**Include**:
- Endpoint description
- Request/response examples
- Error responses
- Authentication requirements
- Rate limits

**Keep Updated**: Update docs when changing endpoints.

**User-Friendly**: Provide examples, use clear language.

**Current Project**: Consider adding Swagger for API documentation.

