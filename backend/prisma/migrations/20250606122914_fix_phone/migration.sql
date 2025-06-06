/*
  Warnings:

  - You are about to alter the column `phone` on the `tbClient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE `tbClient` MODIFY `phone` VARCHAR(11) NOT NULL;
