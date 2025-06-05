/*
  Warnings:

  - The values [credit,debit] on the enum `tbTransaction_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tbTransaction` MODIFY `type` ENUM('CREDIT', 'DEBIT') NOT NULL;
