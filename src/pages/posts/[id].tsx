import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';

type PostByIdOutput = RouterOutput['posts']['byId'];

function PostItem(props: { post: PostByIdOutput }) {
  const { post } = props;
  return (
    <div>
      <h1>{post.title}</h1>
      <hr />
      <h2>Created at</h2>
      <em>{post.createdAt.toLocaleDateString('en-us')}</em>
      <hr />
      <h2>Description</h2>
      <p>{post.body}</p>
      <hr />
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(post, null, 4)}</pre>
    </div>
  );
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const { data, error, isLoading } = trpc.posts.byId.useQuery({ id });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return (
      <NextError
        title={error.message}
        statusCode={error.data?.httpStatus ?? 500}
      />
    );
  }

  return <PostItem post={data} />;
};

export default PostViewPage;
