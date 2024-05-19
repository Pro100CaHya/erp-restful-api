/*
  Warnings:

  - You are about to drop the column `access_token` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `is_access_token_revoked` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Session_access_token_key` ON `Session`;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `access_token`,
    DROP COLUMN `is_access_token_revoked`;

-- CreateTable
CREATE TABLE `AccessTokenBlackList` (
    `access_token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AccessTokenBlackList_access_token_key`(`access_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
