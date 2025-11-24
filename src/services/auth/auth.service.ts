/**
 * Authentication Service
 * Handles user registration and login logic including password hashing and verification.
 * @module services/auth
 */
// src/services/auth.service.ts

import { AppError } from "@/errors/AppErrors.js";
import { prisma } from "@/lib/prisma.js";
import { hashPassword, verifyPassword } from "@/utils/hash.js";

/**
 * Registers a new user.
 *
 * @param email - User's email (must be unique)
 * @param password - Plain-text password (will be hashed)
 * @returns User object (without password)
 * @throws AppError if email is already in use
 */
export const registerUser = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 409, "EMAIL_ALREADY_EXISTS");
  }

  // Hash password securely
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Authenticates a user.
 *
 * @param email - User's email
 * @param password - Plain-text password
 * @returns User object (without password)
 * @throws AppError if credentials are invalid
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // if user doesnt exist say, email doesnt not exist Please proced to sign up
    throw new AppError("Email not found", 404, "EMAIL_NOT_FOUND");
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};
