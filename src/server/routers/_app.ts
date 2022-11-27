import { router } from '../trpc';
import { postRouter } from './posts';
import { userRouter } from './user';

export const appRouter = router({
  posts: postRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
