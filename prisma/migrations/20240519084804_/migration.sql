/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `isAccessTokenRevoked` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Session_accessToken_key` ON `Session`;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `accessToken`,
    DROP COLUMN `isAccessTokenRevoked`,
    ADD COLUMN `access_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_access_token_revoked` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Session_access_token_key` ON `Session`(`access_token`);
