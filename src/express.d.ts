// src/types/express.d.ts

import type { Request } from "express";
import { z, ZodTypeAny } from "zod";

// Infer the type from a Zod schema
export type InferInput<T extends ZodTypeAny> = T extends ZodTypeAny
  ? z.infer<T>
  : never;

// Typed request that carries your validated shape
export interface TypedRequest<T> extends Request {
  body: T;
}
