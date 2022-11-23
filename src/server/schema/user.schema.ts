import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
