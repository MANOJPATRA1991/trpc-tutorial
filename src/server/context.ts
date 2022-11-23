/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '~/utils/jwt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContextUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  expiry: number;
}

interface CreateContextOptions {
  req: NextApiRequest;
  res: NextApiResponse<any>;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  const { req, res } = _opts;
  const { token } = req.cookies;

  let user = null;

  if (token) {
    try {
      user = verifyJwt<ContextUser>(token);
    } catch (e) {
      user = null;
    }
  }

  return { session: { user }, req, res };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  return await createContextInner({ ...opts });
}
