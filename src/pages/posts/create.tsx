import { useRouter } from 'next/router';
import { useZodForm } from '~/hooks/useZodForm';
import {
  CreatePostInput,
  createPostSchema,
} from '~/server/schema/posts.schema';
import { trpc } from '~/utils/trpc';

function CreatePostPage() {
  const router = useRouter();
  const { mutate, error } = trpc.posts['add'].useMutation({
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
    },
  });

  const methods = useZodForm({
    schema: createPostSchema,
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {error && error.message}

      <h1>Create Post</h1>

      <input
        type="text"
        placeholder="Your post title"
        {...methods.register('title')}
      />
      <br />
      <textarea placeholder="Your post body" {...methods.register('body')} />
      <button>Create post</button>
    </form>
  );
}

export default CreatePostPage;
