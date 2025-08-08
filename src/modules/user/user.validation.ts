import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short. Minimum 2 characters long" })
    .max(50, {
      message: "Name is too long. Maximum 50 characters allowed",
    }),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
  phone: z
    .string()
    .regex(/^(\+8801|01)[0-9]{9}$/, {
      message: "Invalid phone number format",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string " })
    .min(2, { message: "Address is too short. Minimum 2 characters long" })
    .max(50, {
      message: "Address is too long. Maximum 50 characters allowed",
    })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short. Minimum 2 characters long" })
    .max(50, {
      message: "Name is too long. Maximum 50 characters allowed",
    })
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(\+8801|01)[0-9]{9}$/, {
      message: "Invalid phone number format",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string " })
    .min(2, { message: "Address is too short. Minimum 2 characters long" })
    .max(50, {
      message: "Address is too long. Maximum 50 characters allowed",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
});