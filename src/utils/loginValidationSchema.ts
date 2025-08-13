import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});
