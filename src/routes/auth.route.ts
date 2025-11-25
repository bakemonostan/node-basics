// src/routes/auth.routes.ts
import { login, register } from "@/controllers/auth.controller.js";
import { validateBody } from "@/middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "@/validations/auth.schema.js";
import { Router } from "express";

const router = Router();

// Route handlers
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;

