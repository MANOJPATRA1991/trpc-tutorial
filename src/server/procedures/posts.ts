import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import {
  createPostSchema,
  listPostsSchema,
  readPostByIdSchema,
} from '../schema/posts.schema';
import { protectedProcedure } from '../trpc';

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  body: true,
  createdAt: true,
  updatedAt: true,
});

export const getPosts = protectedProcedure
  .input(listPostsSchema)
  .query(async ({ input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const posts = await prisma.post.findMany({
      select: defaultPostSelect,
      take: limit + 1,
      where: {},
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (posts.length > limit) {
      const nextPost = posts.pop();
      nextCursor = nextPost?.id;
    }

    return {
      posts: posts.reverse(),
      nextCursor,
    };
  });

export const getPostById = protectedProcedure
  .input(readPostByIdSchema)
  .query(async ({ input }) => {
    const { id } = input;
    const post = await prisma.post.findUnique({
      where: { id },
      select: defaultPostSelect,
    });

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No post found with id: ${id}`,
      });
    }

    return post;
  });

export const createPost = protectedProcedure
  .input(createPostSchema)
  .mutation(async ({ ctx, input }) => {
    const post = await prisma.post.create({
      data: {
        ...input,
        user: {
          connect: {
            id: ctx.session.user?.id,
          },
        },
      },
      select: defaultPostSelect,
    });

    return post;
  });
