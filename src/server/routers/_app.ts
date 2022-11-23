import { router } from '../trpc';
import { postRouter } from './post';
import { userRouter } from './user';

export const appRouter = router({
  posts: postRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
