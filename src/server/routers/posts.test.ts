/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '../context';
import { AppRouter, appRouter } from './_app';
import { inferProcedureInput } from '@trpc/server';
import test, { expect } from '@playwright/test';

test('add and get post', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter['posts']['add']> = {
    body: 'hello test',
    title: 'hello test',
  };

  const post = await caller.posts.add(input);
  const byId = await caller.posts.byId({ id: post.id });

  expect(byId).toMatchObject(input);
});
