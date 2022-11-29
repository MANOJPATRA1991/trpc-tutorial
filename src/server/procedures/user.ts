import { CookieSerializeOptions, serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import { prisma } from '~/server/prisma';
import { signJwt, verifyJwt } from '~/utils/jwt';
import { publicProcedure, protectedProcedure } from '../trpc';
import {
  registerUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
  loginUserSchema,
} from '../schema/user.schema';
import { TRPCError } from '@trpc/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { sendLoginEmail } from '~/utils/mailer';
import redisClient from '../redis';
import { LoginToken, User } from '@prisma/client';

const cookieOptions: CookieSerializeOptions = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export const getUser = publicProcedure.query(async ({ ctx }) => {
  return ctx.session.user;
});

export const loginUser = publicProcedure
  .input(loginUserSchema)
  .mutation(async ({ input }) => {
    const { email, password } = input;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid email or password',
      });
    }

    return true;
  });

export const verifyOtp = publicProcedure
  .input(verifyOtpSchema)
  .mutation(async ({ input, ctx }) => {
    const requestToken = await redisClient.get('request_token');
    const { id, email } = JSON.parse(requestToken as string);
    const token: (LoginToken & { user: User }) | null =
      await prisma.loginToken.findFirst({
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

    if (token.otp !== input.otp) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Incorrect OTP entered',
      });
    }

    await redisClient.del('request_token');

    redisClient.set(`${token.user.id}`, JSON.stringify(token.user), {
      EX: 60 * 60,
    });

    const accessToken = signJwt(
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      {
        email: token.user.email,
        id: token.user.id,
      },
      {
        expiresIn: `15m`,
      },
    );

    const refreshToken = signJwt(
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
      {
        email: token.user.email,
        id: token.user.id,
      },
      {
        expiresIn: `60m`,
      },
    );

    console.log({ accessToken, refreshToken });

    ctx.res.setHeader('Set-Cookie', [
      serialize('access_token', accessToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      }),
      serialize('refresh_token', refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      }),
      serialize('logged_in', 'true', {
        ...cookieOptions,
        httpOnly: false,
      }),
    ]);

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

    const otp = generateOTP();

    const token = await prisma.loginToken.create({
      data: {
        redirect,
        otp,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    redisClient.set(
      'request_token',
      JSON.stringify({ id: token.id, email: user.email }),
      {
        EX: 60,
      },
    );

    await sendLoginEmail({
      otp,
      email: user.email,
    });

    return true;
  });

export const registerUser = publicProcedure
  .input(registerUserSchema)
  .mutation(async ({ input }) => {
    const { name, email, password } = input;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
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

export const refreshUserToken = publicProcedure.query(async ({ ctx }) => {
  const { refresh_token } = ctx.req.cookies;
  const message = 'Could not refresh access token';
  if (!refresh_token) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message,
    });
  }

  const decoded: any = verifyJwt(
    process.env.REFRESH_TOKEN_PUBLIC_KEY as string,
    refresh_token,
  );
  if (!decoded) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message,
    });
  }

  const session = await redisClient.get(decoded.id);
  if (!session) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });
  if (!user) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message,
    });
  }

  const accessToken = signJwt(
    process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
    {
      email: decoded.email,
      id: decoded.id,
    },
    {
      expiresIn: `15m`,
    },
  );

  ctx.res.setHeader('Set-Cookie', [
    serialize('access_token', accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    }),
    serialize('logged_in', 'true', {
      ...cookieOptions,
      httpOnly: false,
    }),
  ]);

  return true;
});

export const logoutUser = protectedProcedure.mutation(async ({ ctx }) => {
  const { user } = ctx.session;
  await redisClient.del(String(user?.id));
  ctx.res.setHeader('Set-Cookie', [
    serialize('access_token', '', {
      ...cookieOptions,
      maxAge: -1,
    }),
    serialize('refresh_token', '', {
      ...cookieOptions,
      maxAge: -1,
    }),
    serialize('logged_in', '', {
      ...cookieOptions,
      maxAge: -1,
    }),
  ]);

  return true;
});
