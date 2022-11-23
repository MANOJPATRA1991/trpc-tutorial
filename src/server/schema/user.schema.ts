import { z } from 'zod';

const createUser = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type CreateUser = z.TypeOf<typeof createUser>;

const requestOtp = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

export type RequestOtp = z.TypeOf<typeof requestOtp>;

const verifyOtp = z.object({
  hash: z.string(),
});

export const UserSchema = {
  createUser,
  requestOtp,
  verifyOtp,
};
