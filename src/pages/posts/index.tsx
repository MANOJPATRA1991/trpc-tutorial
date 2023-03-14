import Link from 'next/link';
import { Fragment } from 'react';
import { Button } from '~/components/Button';
import { trpc } from '~/utils/trpc';

function PostListsPage() {
  const postsQuery = trpc.posts['list'].useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  return (
    <div>
      <Button
        onClick={() => postsQuery.fetchPreviousPage()}
        disabled={
          !postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
        }
      >
        {postsQuery.isFetchingPreviousPage
          ? 'Loading more...'
          : postsQuery.hasPreviousPage
          ? 'Load more'
          : 'Nothing more to load'}
      </Button>
      <Button>
        <Link href="posts/create">Create post</Link>
      </Button>
      {postsQuery.data?.pages.map((page, index) => (
        <Fragment key={page.posts[0]?.id || index}>
          {page.posts.map((post) => (
            <article
              className="flex items-center justify-between"
              key={post.id}
            >
              <p className="mr-3">{post.title}</p>
              <Button>
                <Link href={`/posts/${post.id}`}>Read post</Link>
              </Button>
            </article>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export default PostListsPage;
