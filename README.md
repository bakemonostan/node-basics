# Node.js TypeScript Authentication API

A production-ready authentication API built with Node.js, TypeScript, Express, Prisma, and Redis. Features automated OpenAPI documentation generation, session-based authentication, and comprehensive error handling.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** database
- **Redis** server
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd beginner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

---

## 📚 Documentation

- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON**: [http://localhost:3000/docs-json](http://localhost:3000/docs-json)
- **Detailed Documentation**: See [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## 🏗️ Tech Stack

### Core
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express 5** - Web framework

### Database & ORM
- **PostgreSQL** - Primary database
- **Prisma** - Type-safe ORM
- **Redis** - Session store

### Authentication & Security
- **express-session** - Session management
- **connect-redis** - Redis session store
- **argon2** - Password hashing

### Validation & Documentation
- **Zod** - Runtime type validation
- **zod-to-openapi** - Automated OpenAPI generation
- **Swagger UI** - Interactive API documentation

---

## 📁 Project Structure

```
beginner/
├── src/
│   ├── config/              # Configuration files
│   │   ├── openapi.config.ts       # OpenAPI setup & schemas
│   │   ├── responses.config.ts     # Reusable response builders
│   │   └── routes/                 # Route documentation configs
│   │       ├── index.ts            # Aggregates all route configs
│   │       └── auth.route.config.ts # Auth endpoint documentation
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.ts
│   ├── errors/              # Custom error classes
│   │   └── AppErrors.ts
│   ├── lib/                 # External service clients
│   │   ├── prisma.ts        # Prisma client
│   │   └── redis.ts         # Redis client
│   ├── middleware/          # Express middleware
│   │   ├── error.middleware.ts     # Global error handler
│   │   ├── session.middleware.ts   # Session configuration
│   │   └── validate.middleware.ts  # Zod validation middleware
│   ├── routes/              # Route definitions
│   │   └── auth.route.ts
│   ├── services/            # Business logic
│   │   └── auth/
│   │       └── auth.service.ts
│   ├── types/               # TypeScript type definitions
│   │   └── error.types.ts
│   ├── utils/               # Utility functions
│   │   ├── hash.ts          # Password hashing
│   │   └── response.ts      # Response formatters
│   ├── validations/         # Zod schemas
│   │   └── auth.schema.ts
│   ├── express.d.ts         # Express type extensions
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── README.md                # This file
└── DOCUMENTATION.md         # Detailed documentation
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Session
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# Server
PORT=3000
NODE_ENV="development"
```

---

## 🛣️ API Endpoints

### Authentication

| Method | Endpoint              | Description           | Auth Required |
|--------|-----------------------|-----------------------|---------------|
| POST   | `/api/auth/register`  | Register new user     | No            |
| POST   | `/api/auth/login`     | Login user            | No            |
| GET    | `/health`             | Health check          | No            |

### Example: Register User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

**Response:**
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

---

## 🔐 Security Features

- ✅ **HTTP-only cookies** - Prevents XSS attacks
- ✅ **Secure flag** - HTTPS-only in production
- ✅ **SameSite=Lax** - CSRF protection
- ✅ **Argon2 password hashing** - Industry-standard hashing
- ✅ **Redis-backed sessions** - Scalable session management
- ✅ **Input validation** - Zod schema validation
- ✅ **Type safety** - Full TypeScript coverage

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## 📦 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
```

---

## 🎯 Key Features

### 1. Automated OpenAPI Documentation
- No manual JSDoc comments needed
- Documentation generated from Zod schemas
- Always in sync with code
- Interactive Swagger UI

### 2. Type-Safe Validation
- Zod schemas for runtime validation
- TypeScript for compile-time safety
- Single source of truth for types and validation

### 3. Session-Based Authentication
- HTTP-only cookies
- Redis-backed sessions
- Automatic session cleanup
- Scalable architecture

### 4. Clean Architecture
- Separation of concerns
- Feature-based organization
- Reusable components
- Easy to extend

---

## 🔄 Adding New Features

### 1. Create Validation Schema
```typescript
// src/validations/profile.schema.ts
export const updateProfileSchema = registry.register(
  "UpdateProfile",
  z.object({
    name: z.string().openapi({ example: "John Doe" })
  }).openapi("UpdateProfile")
);
```

### 2. Create Route Config
```typescript
// src/config/routes/profile.route.config.ts
export function registerProfileRoutes() {
  registry.registerPath({
    method: "put",
    path: "/api/profile",
    summary: "Update user profile",
    tags: ["Profile"],
    request: { body: { content: { "application/json": { schema: updateProfileSchema } } } },
    responses: { 200: userSuccessResponse(200, "Profile updated") }
  });
}
```

### 3. Create Route Handler
```typescript
// src/routes/profile.route.ts
const router = Router();
router.put("/", validateBody(updateProfileSchema), updateProfile);
export default router;
```

### 4. Register Routes
```typescript
// src/config/routes/index.ts
import { registerProfileRoutes } from "./profile.route.config.js";

export function registerAllRoutes() {
  registerAuthRoutes();
  registerProfileRoutes(); // Add this
}
```

That's it! Documentation is auto-generated. ✨

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U username -d dbname
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redis Documentation](https://redis.io/docs/)

---

## 📝 License

ISC

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, TypeScript, and modern best practices**
