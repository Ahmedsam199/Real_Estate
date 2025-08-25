/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Contract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Contract` DROP FOREIGN KEY `Contract_ownerId_fkey`;

-- DropIndex
DROP INDEX `Contract_ownerId_fkey` ON `Contract`;

-- AlterTable
ALTER TABLE `Contract` DROP COLUMN `ownerId`;
