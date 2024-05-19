/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `File_name_key` ON `File`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `name`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `File_filename_key` ON `File`(`filename`);
