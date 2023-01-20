-- AlterTable
ALTER TABLE `Tower` ADD COLUMN `nextUpgradeCost` INTEGER NULL;

-- CreateTable
CREATE TABLE `AuthDetails` (
    `id` INTEGER NOT NULL,
    `nonce` VARCHAR(191) NOT NULL,
    `timestamp` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AuthDetails_id_key`(`id`),
    UNIQUE INDEX `AuthDetails_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Cell_mapId_idx` ON `Cell`(`mapId`);
