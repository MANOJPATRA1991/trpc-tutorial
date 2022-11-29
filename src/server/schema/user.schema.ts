import { TypeOf, z } from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email or password'),
  password: z
    .string({ required_error: 'Password is required' })
    .email('Invalid email or password'),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email'),
    photo: z.string({ required_error: 'Photo is required' }),
    passwordConfirm: z.string({
      required_error: 'Please confirm your password',
    }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(15, 'Password must be less than 32 characters'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

export type CreateUserInput = TypeOf<typeof registerUserSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

export type RequestOtpInput = TypeOf<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
