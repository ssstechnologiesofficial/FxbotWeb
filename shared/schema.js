import { z } from "zod";

// Contact form schema
export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required")
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required")
});

// User registration schema
export const userRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user")
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required")
});

// Investment package schema
export const investmentPackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['fixed', 'affiliate', 'direct', 'salary']),
  minimum: z.number().optional(),
  return: z.string().optional(),
  commission: z.string().optional(),
  duration: z.string().optional()
});