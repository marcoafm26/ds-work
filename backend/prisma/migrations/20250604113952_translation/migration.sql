/*
  Warnings:

  - You are about to drop the `tbCliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbConta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbLancamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbConta` DROP FOREIGN KEY `tbConta_tbCliente_FK`;

-- DropForeignKey
ALTER TABLE `tbLancamento` DROP FOREIGN KEY `tbLancamento_tbConta_FK`;

-- DropTable
DROP TABLE `tbCliente`;

-- DropTable
DROP TABLE `tbConta`;

-- DropTable
DROP TABLE `tbLancamento`;

-- CreateTable
CREATE TABLE `tbClient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `phone` VARCHAR(12) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tbClient_unique`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(9) NOT NULL,
    `clientId` INTEGER NOT NULL,

    UNIQUE INDEX `tbAccount_unique`(`number`),
    INDEX `tbAccount_tbClient_FK`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `type` ENUM('credit', 'debit') NOT NULL,
    `accountId` INTEGER NOT NULL,

    INDEX `tbTransaction_tbAccount_FK`(`accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbAccount` ADD CONSTRAINT `tbAccount_tbClient_FK` FOREIGN KEY (`clientId`) REFERENCES `tbClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbTransaction` ADD CONSTRAINT `tbTransaction_tbAccount_FK` FOREIGN KEY (`accountId`) REFERENCES `tbAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
