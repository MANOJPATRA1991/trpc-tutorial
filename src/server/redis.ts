import { createClient } from 'redis';

const url = `redis://redis:6379`;
const redisClient = createClient({ url });

const connectRedis = async () => {
  try {
    await redisClient.connect();
    redisClient.set(
      'tRPC',
      'Welcome to tRPC with Next.js, Prisma and TypeScript',
    );
    console.log('🚀 Redis client connected...');
  } catch (e: any) {
    console.log(e.message);
    process.exit(1);
  }
};

connectRedis();

redisClient.on('error', console.log);

export default redisClient;
