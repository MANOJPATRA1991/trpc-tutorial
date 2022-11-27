import Link from 'next/link';
import { Fragment } from 'react';
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
      <button
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
      </button>
      {postsQuery.data?.pages.map((page, index) => (
        <Fragment key={page.posts[0]?.id || index}>
          {page.posts.map((post) => (
            <article key={post.id}>
              <p>{post.title}</p>
              <Link href={`/posts/${post.id}`}>Read post</Link>
            </article>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export default PostListsPage;
