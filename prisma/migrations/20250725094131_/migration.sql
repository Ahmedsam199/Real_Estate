/*
  Warnings:

  - The values [RESIDENTIAL] on the enum `Property_propertyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `property` MODIFY `propertyType` ENUM('HOME', 'APPARTMENT', 'VILLA', 'COMMERCIAL', 'INDUSTRIAL', 'LAND') NOT NULL;
