/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT DEFAULT 'avatar-user.png',
ADD COLUMN     "role" "RoleEnumType" DEFAULT 'user',
ADD COLUMN     "verified" BOOLEAN DEFAULT false,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
