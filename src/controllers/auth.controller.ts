// src/controllers/auth.controller.ts

import type { TypedRequest } from "@/express.js";
import { loginUser, registerUser } from "@/services/auth/auth.service.js";
import { createResponse } from "@/utils/response.js";
import type { loginSchema, registerSchema } from "@/validations/auth.schema.js";
import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
/**
 * Health check controller.
 * Used to verify the server is running.
 */
export const getHealth = (req: Request, res: Response, _next: NextFunction) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export const register = async (
  req: TypedRequest<RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    const response = createResponse(
      201,
      { user },
      "User registered successfully"
    );
    return res.status(201).json(response);
  } catch (error) {
    next(error); // pass AppError to global error handler
  }
};

export const login = async (
  req: TypedRequest<LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const response = createResponse(
      200,
      { user },
      "User logged in successfully"
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Root route controller.
 */
export const getRoot = (req: Request, res: Response, _next: NextFunction) => {
  res.send("Testing");
};
