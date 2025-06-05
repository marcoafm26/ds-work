-- CreateTable
CREATE TABLE `tbCliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `telefone` VARCHAR(12) NULL,
    `senha` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tbCliente_unique`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbConta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(9) NOT NULL,
    `idCliente` INTEGER NOT NULL,

    UNIQUE INDEX `tbConta_unique`(`numero`),
    INDEX `tbConta_tbCliente_FK`(`idCliente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbLancamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('credito', 'debito') NOT NULL,
    `idConta` INTEGER NOT NULL,

    INDEX `tbLancamento_tbConta_FK`(`idConta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbConta` ADD CONSTRAINT `tbConta_tbCliente_FK` FOREIGN KEY (`idCliente`) REFERENCES `tbCliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbLancamento` ADD CONSTRAINT `tbLancamento_tbConta_FK` FOREIGN KEY (`idConta`) REFERENCES `tbConta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
