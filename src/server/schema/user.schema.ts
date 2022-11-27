import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email(),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof registerUserSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
