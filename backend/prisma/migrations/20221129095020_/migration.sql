/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Land` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Land_id_key` ON `Land`(`id`);
