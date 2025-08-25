/*
  Warnings:

  - Added the required column `doctype` to the `PrintSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PrintSettings` ADD COLUMN `doctype` VARCHAR(191) NOT NULL;
