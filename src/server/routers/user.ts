import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { UserSchema } from '../schema/user.schema';
import { signJwt } from '~/utils/jwt';
import { serialize } from 'cookie';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const userRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),
  'verify-otp': publicProcedure
    .input(UserSchema.verifyOtp)
    .query(async ({ input, ctx }) => {
      const decoded = input.hash.split(':');
      const [id, email] = decoded;
      const token = await prisma.loginToken.findFirst({
        where: {
          id,
          user: { email },
        },
        include: { user: true },
      });

      if (!token) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token',
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }));

      return { redirect: token.redirect };
    }),
  'request-otp': publicProcedure
    .input(UserSchema.requestOtp)
    .query(async ({ input }) => {
      const { email, redirect } = input;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      await prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return true;
    }),
  'register-user': publicProcedure
    .input(UserSchema.createUser)
    .mutation(async ({ input }) => {
      const { name, email } = input;

      try {
        const user = await prisma.user.create({
          data: { email, name },
        });

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'User already exists',
            });
          }
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        });
      }
    }),
});
