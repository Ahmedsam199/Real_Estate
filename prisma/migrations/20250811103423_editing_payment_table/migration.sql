/*
  Warnings:

  - Added the required column `paymentStatus` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `paymentStatus` ENUM('PAID', 'ON_HOLD') NOT NULL,
    ADD COLUMN `remarks` VARCHAR(191) NULL;
