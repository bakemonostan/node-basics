# Technical Documentation

Comprehensive technical documentation for the Node.js TypeScript Authentication API.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Database Schema](#database-schema)
4. [OpenAPI Documentation System](#openapi-documentation-system)
5. [Error Handling](#error-handling)
6. [Validation System](#validation-system)
7. [Session Management](#session-management)
8. [Security Best Practices](#security-best-practices)
9. [Code Organization](#code-organization)
10. [API Reference](#api-reference)

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│           Client (Browser/App)          │
└─────────────────┬───────────────────────┘
                  │ HTTP Requests
┌─────────────────▼───────────────────────┐
│         Routes Layer (Express)          │
│  - Route definitions                    │
│  - Middleware application               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Middleware Layer                   │
│  - Validation (Zod)                     │
│  - Session management                   │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Controllers Layer                  │
│  - Request/Response handling            │
│  - Input extraction                     │
│  - Response formatting                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Services Layer                     │
│  - Business logic                       │
│  - Data transformation                  │
│  - External service calls               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Data Layer (Prisma)                │
│  - Database operations                  │
│  - Query building                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Database (PostgreSQL)              │
└─────────────────────────────────────────┘
```

### Technology Stack Details

#### Runtime & Language
- **Node.js 18+**: JavaScript runtime
- **TypeScript 5.9**: Static typing and modern JavaScript features
- **ES Modules**: Modern module system (`"type": "module"`)

#### Web Framework
- **Express 5.1**: Web application framework
  - Async/await support
  - Improved error handling
  - Better TypeScript support

#### Database
- **PostgreSQL**: Primary database
- **Prisma 7.0**: Type-safe ORM
  - Auto-generated types
  - Migration system
  - Query builder

#### Session & Caching
- **Redis**: Session store and caching
- **IORedis 5.8**: Redis client
- **connect-redis 9.0**: Express session store adapter

#### Security
- **argon2**: Password hashing (more secure than bcrypt)
- **express-session**: Session management
- HTTP-only cookies
- CSRF protection via SameSite cookies

#### Validation & Documentation
- **Zod 4.1**: Runtime type validation
- **zod-to-openapi 8.1**: Automated OpenAPI spec generation
- **Swagger UI Express**: Interactive API documentation

---

## Authentication Flow

### Registration Flow

```
┌──────┐                                    ┌────────┐
│Client│                                    │ Server │
└──┬───┘                                    └───┬────┘
   │                                            │
   │  POST /api/auth/register                  │
   │  { email, password }                      │
   ├──────────────────────────────────────────>│
   │                                            │
   │                          ┌─────────────────▼────────────┐
   │                          │ 1. Validate input (Zod)      │
   │                          │ 2. Check if email exists     │
   │                          │ 3. Hash password (Argon2)    │
   │                          │ 4. Create user in DB         │
   │                          │ 5. Create session            │
   │                          │ 6. Set session cookie        │
   │                          └─────────────────┬────────────┘
   │                                            │
   │  201 Created                               │
   │  Set-Cookie: connect.sid=...              │
   │  { user: { id, email, createdAt } }       │
   │<──────────────────────────────────────────┤
   │                                            │
```

### Login Flow

```
┌──────┐                                    ┌────────┐
│Client│                                    │ Server │
└──┬───┘                                    └───┬────┘
   │                                            │
   │  POST /api/auth/login                     │
   │  { email, password }                      │
   ├──────────────────────────────────────────>│
   │                                            │
   │                          ┌─────────────────▼────────────┐
   │                          │ 1. Validate input (Zod)      │
   │                          │ 2. Find user by email        │
   │                          │ 3. Verify password (Argon2)  │
   │                          │ 4. Create session            │
   │                          │ 5. Set session cookie        │
   │                          └─────────────────┬────────────┘
   │                                            │
   │  200 OK                                    │
   │  Set-Cookie: connect.sid=...              │
   │  { user: { id, email, createdAt } }       │
   │<──────────────────────────────────────────┤
   │                                            │
```

### Session Validation Flow

```
┌──────┐                                    ┌────────┐
│Client│                                    │ Server │
└──┬───┘                                    └───┬────┘
   │                                            │
   │  GET /api/protected-route                 │
   │  Cookie: connect.sid=...                  │
   ├──────────────────────────────────────────>│
   │                                            │
   │                          ┌─────────────────▼────────────┐
   │                          │ 1. Extract session ID        │
   │                          │ 2. Lookup session in Redis   │
   │                          │ 3. Validate session          │
   │                          │ 4. Load user data            │
   │                          │ 5. Process request           │
   │                          └─────────────────┬────────────┘
   │                                            │
   │  200 OK                                    │
   │  { data: ... }                            │
   │<──────────────────────────────────────────┤
   │                                            │
```

---

## Database Schema

### User Table

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Field Descriptions

| Field       | Type     | Description                              |
|-------------|----------|------------------------------------------|
| `id`        | UUID     | Primary key, auto-generated              |
| `email`     | String   | Unique email address                     |
| `password`  | String   | Argon2 hashed password                   |
| `createdAt` | DateTime | Account creation timestamp               |
| `updatedAt` | DateTime | Last update timestamp (auto-updated)     |

### Indexes

- **Primary Key**: `id`
- **Unique Index**: `email` (for fast lookups and uniqueness constraint)

---

## OpenAPI Documentation System

### How It Works

The project uses **zod-to-openapi** to automatically generate OpenAPI specifications from Zod validation schemas. This eliminates the need for manual JSDoc comments and ensures documentation is always in sync with code.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Zod Schemas                            │
│  (src/validations/*.schema.ts)                          │
│  - Define validation rules                              │
│  - Add OpenAPI metadata (.openapi())                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Registered with
                  ▼
┌─────────────────────────────────────────────────────────┐
│              OpenAPI Registry                           │
│  (src/config/openapi.config.ts)                         │
│  - Collects all schemas                                 │
│  - Defines reusable components                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Used by
                  ▼
┌─────────────────────────────────────────────────────────┐
│            Route Configurations                         │
│  (src/config/routes/*.route.config.ts)                  │
│  - Register endpoints                                   │
│  - Define request/response schemas                      │
│  - Add examples                                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Generates
                  ▼
┌─────────────────────────────────────────────────────────┐
│           OpenAPI Specification                         │
│  - Complete API documentation                           │
│  - Served at /docs-json                                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Powers
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Swagger UI                                 │
│  - Interactive documentation at /docs                   │
│  - Try it out functionality                             │
│  - Schema visualization                                 │
└─────────────────────────────────────────────────────────┘
```

### File Organization

```
src/config/
├── openapi.config.ts           # Core OpenAPI setup
│   ├── Registry initialization
│   ├── Reusable schemas (User, Error, etc.)
│   └── Spec generator function
│
├── responses.config.ts         # Shared response builders
│   ├── validationErrorResponse
│   ├── errorResponse
│   └── userSuccessResponse
│
└── routes/                     # Route documentation
    ├── index.ts                # Aggregates all routes
    └── auth.route.config.ts    # Auth endpoint docs
```

### Example: Adding Documentation

#### 1. Define Zod Schema with OpenAPI Metadata

```typescript
// src/validations/profile.schema.ts
import { z } from "zod";
import { registry } from "@/config/openapi.config.js";

export const updateProfileSchema = registry.register(
  "UpdateProfile",
  z.object({
    name: z.string().min(1).max(100).openapi({
      description: "User's full name",
      example: "John Doe"
    }),
    bio: z.string().max(500).optional().openapi({
      description: "User biography",
      example: "Software developer from NYC"
    })
  }).openapi("UpdateProfile")
);
```

#### 2. Create Route Configuration

```typescript
// src/config/routes/profile.route.config.ts
import { registry } from "@/config/openapi.config.js";
import { updateProfileSchema } from "@/validations/profile.schema.js";
import { userSuccessResponse, validationErrorResponse } from "@/config/responses.config.js";

export function registerProfileRoutes() {
  registry.registerPath({
    method: "put",
    path: "/api/profile",
    summary: "Update user profile",
    description: "Update the authenticated user's profile information",
    tags: ["Profile"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: updateProfileSchema
          }
        }
      }
    },
    responses: {
      200: userSuccessResponse(200, "Profile updated successfully"),
      400: validationErrorResponse,
      401: errorResponse(401, "Unauthorized", "UNAUTHORIZED", "Not authenticated")
    }
  });
}
```

#### 3. Register in Index

```typescript
// src/config/routes/index.ts
import { registerAuthRoutes } from "./auth.route.config.js";
import { registerProfileRoutes } from "./profile.route.config.js";

export function registerAllRoutes() {
  registerAuthRoutes();
  registerProfileRoutes(); // Add this
}
```

That's it! The documentation is automatically generated and available in Swagger UI.

---

## Error Handling

### Error Hierarchy

```
AppError (base class)
├── ValidationError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
└── ConflictError (409)
```

### Custom Error Classes

```typescript
// src/errors/AppErrors.ts

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = "CONFLICT") {
    super(409, message, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, code: string = "UNAUTHORIZED") {
    super(401, message, code);
  }
}
```

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Email already in use",
    "code": "EMAIL_ALREADY_EXISTS",
    "statusCode": 409,
    "timestamp": "2025-11-25T00:00:00.000Z"
  }
}
```

### Global Error Handler

```typescript
// src/middleware/error.middleware.ts

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Unexpected errors
  console.error("Unexpected error:", err);
  res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      timestamp: new Date().toISOString()
    }
  });
};
```

---

## Validation System

### Zod Schema Structure

```typescript
// Basic schema
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// With OpenAPI metadata
const schemaWithDocs = registry.register(
  "SchemaName",
  z.object({
    email: z.string().email().openapi({
      description: "User's email address",
      example: "user@example.com"
    }),
    password: z.string().min(8).openapi({
      description: "User's password",
      example: "Password123!",
      minLength: 8
    })
  }).openapi("SchemaName")
);
```

### Validation Middleware

```typescript
// src/middleware/validate.middleware.ts

export const validateBody = <T extends ZodTypeAny>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
```

### Usage in Routes

```typescript
router.post(
  "/register",
  validateBody(registerSchema),  // Validates before controller
  register
);
```

---

## Session Management

### Configuration

```typescript
// src/middleware/session.middleware.ts

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
});
```

### Session Storage

Sessions are stored in Redis with the following structure:

```
Key: sess:${sessionId}
Value: {
  "cookie": {
    "originalMaxAge": 604800000,
    "expires": "2025-12-02T00:00:00.000Z",
    "secure": false,
    "httpOnly": true,
    "sameSite": "lax"
  },
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
TTL: 604800 seconds (7 days)
```

### Session Lifecycle

1. **Creation**: When user logs in or registers
2. **Storage**: Saved to Redis with TTL
3. **Validation**: Checked on each request
4. **Renewal**: TTL refreshed on activity
5. **Expiration**: Auto-deleted after 7 days of inactivity

---

## Security Best Practices

### Password Security

```typescript
// Hashing (Argon2)
const hashedPassword = await hash(plainPassword);

// Verification
const isValid = await verify(hashedPassword, plainPassword);
```

**Why Argon2?**
- Winner of Password Hashing Competition (2015)
- Resistant to GPU cracking attacks
- Memory-hard algorithm
- Better than bcrypt for modern applications

### Cookie Security

| Setting      | Value        | Purpose                              |
|--------------|--------------|--------------------------------------|
| `httpOnly`   | `true`       | Prevents JavaScript access (XSS)     |
| `secure`     | `true` (prod)| HTTPS-only transmission              |
| `sameSite`   | `lax`        | CSRF protection                      |
| `maxAge`     | 7 days       | Automatic expiration                 |

### Input Validation

- **All inputs validated** with Zod schemas
- **Type coercion** disabled (strict validation)
- **Sanitization** via `.trim()`, `.toLowerCase()`
- **Length limits** on all string fields

### SQL Injection Prevention

- **Prisma ORM** uses parameterized queries
- **No raw SQL** in application code
- **Type-safe** query building

---

## Code Organization

### Naming Conventions

#### Files
- **Routes**: `*.route.ts` (e.g., `auth.route.ts`)
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **Middleware**: `*.middleware.ts`
- **Schemas**: `*.schema.ts`
- **Config**: `*.config.ts`

#### Functions
- **Controllers**: `camelCase` (e.g., `registerUser`)
- **Services**: `camelCase` (e.g., `createUser`)
- **Middleware**: `camelCase` (e.g., `validateBody`)
- **Route configs**: `register*Routes` (e.g., `registerAuthRoutes`)

#### Types
- **Interfaces**: `PascalCase` with `I` prefix (e.g., `IUser`)
- **Types**: `PascalCase` (e.g., `UserData`)
- **Enums**: `PascalCase` (e.g., `UserRole`)

### Import Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage:**
```typescript
import { prisma } from "@/lib/prisma.js";
import { registerSchema } from "@/validations/auth.schema.js";
```

### Module Organization

Each feature should have:
- **Route** (`routes/*.route.ts`) - Express routes
- **Controller** (`controllers/*.controller.ts`) - Request handlers
- **Service** (`services/*/*.service.ts`) - Business logic
- **Schema** (`validations/*.schema.ts`) - Validation
- **Route Config** (`config/routes/*.route.config.ts`) - Documentation

---

## API Reference

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**
- Email: Valid email format, trimmed, lowercased
- Password: 
  - Minimum 8 characters
  - Maximum 128 characters
  - Must contain: uppercase, lowercase, number, special character

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "createdAt": "2025-11-25T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

*400 Validation Error:*
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must contain a special character..."
    }
  ]
}
```

*409 Conflict:*
```json
{
  "error": {
    "message": "Email already in use",
    "code": "EMAIL_ALREADY_EXISTS",
    "statusCode": 409,
    "timestamp": "2025-11-25T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "createdAt": "2025-11-25T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

*401 Unauthorized:*
```json
{
  "error": {
    "message": "Invalid credentials",
    "code": "INVALID_CREDENTIALS",
    "statusCode": 401,
    "timestamp": "2025-11-25T00:00:00.000Z"
  }
}
```

---

## Appendix

### Common Tasks

#### Add a New Endpoint

1. Create validation schema
2. Create route config for documentation
3. Create controller function
4. Create service function (if needed)
5. Add route to router
6. Register route config in `routes/index.ts`

#### Update Database Schema

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name migration_name

# 3. Generate Prisma client
npx prisma generate
```

#### Debug Session Issues

```bash
# Check Redis
redis-cli
> KEYS sess:*
> GET sess:${sessionId}

# Check session cookie in browser DevTools
# Application > Cookies > connect.sid
```

---

**Last Updated**: 2025-11-25  
**Version**: 1.0.0
