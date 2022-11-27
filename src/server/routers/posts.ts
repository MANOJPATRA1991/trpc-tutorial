import { router } from '../trpc';
import { createPost, getPostById, getPosts } from '../procedures/posts';

export const postRouter = router({
  list: getPosts,
  byId: getPostById,
  add: createPost,
});
