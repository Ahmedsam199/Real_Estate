/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `PrintSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PrintSettings_title_key` ON `PrintSettings`(`title`);
