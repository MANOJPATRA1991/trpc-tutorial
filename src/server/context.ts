/**
 * This file contains tRPC's context
 *
 * "context" holds data that all of your tRPC procedures will have access to,
 * and is a great place to put things like database connections or authentication information
 */
import { env } from './env';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { verifyJwt } from '~/utils/jwt';

interface ContextUser {
  id: string;
  email: string;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(opts: CreateNextContextOptions) {
  const { req, res } = opts;
  const { access_token } = req.cookies;

  let user = null;

  if (access_token) {
    try {
      user = verifyJwt<ContextUser>(
        env.ACCESS_TOKEN_PUBLIC_KEY as string,
        access_token,
      );
    } catch (e) {
      user = null;
    }
  }

  return { session: { user }, req, res };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;

export async function createContext(
  opts: CreateNextContextOptions,
): Promise<Context> {
  return await createContextInner({ ...opts });
}
