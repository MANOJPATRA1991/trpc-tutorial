import { signJwt } from '~/utils/jwt';
import { serialize } from 'cookie';
import { prisma } from '~/server/prisma';
import { publicProcedure } from '../trpc';
import {
  registerUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from '../schema/user.schema';
import { TRPCError } from '@trpc/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { sendLoginEmail } from '~/utils/mailer';
import { decode, encode } from '~/utils/base64';
import { getBaseUrl } from '~/utils/trpc';

export const getUser = publicProcedure.query(async ({ ctx }) => {
  return ctx.session.user;
});

export const verifyOtp = publicProcedure
  .input(verifyOtpSchema)
  .query(async ({ input, ctx }) => {
    const decoded = decode(input.hash).split(':');
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
  });

export const requestOtp = publicProcedure
  .input(requestOtpSchema)
  .mutation(async ({ input }) => {
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

    const token = await prisma.loginToken.create({
      data: {
        redirect,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await sendLoginEmail({
      token: encode(`${token.id}:${user.email}`),
      url: getBaseUrl(),
      email: user.email,
    });

    return true;
  });

export const registerUser = publicProcedure
  .input(registerUserSchema)
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
  });
