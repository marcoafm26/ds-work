/*
  Warnings:

  - Made the column `telefone` on table `tbCliente` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tbCliente` MODIFY `telefone` VARCHAR(12) NOT NULL;
