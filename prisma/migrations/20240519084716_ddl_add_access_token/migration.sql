/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` ADD COLUMN `accessToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAccessTokenRevoked` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Session_accessToken_key` ON `Session`(`accessToken`);
