import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
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
    console.log({values})
    mutate(values);
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {error && error.message}

      <h1 className="my-3">Create Post</h1>

      <input
        type="text"
        className="placeholder:text-xs mb-6 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
        placeholder="Your post title"
        {...methods.register('title')}
      />
      <br />
      <textarea
        className="placeholder:text-xs mb-6 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-400"
        placeholder="Your post body"
        {...methods.register('body')}
      />
      <Button>Create post</Button>
    </form>
  );
}

export default CreatePostPage;
