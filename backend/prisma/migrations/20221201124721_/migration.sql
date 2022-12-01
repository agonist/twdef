-- CreateTable
CREATE TABLE `Map` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paused` BOOLEAN NOT NULL DEFAULT false,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cell` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `type` ENUM('PATH', 'LAND', 'ROCK', 'SPAWN', 'BASE') NOT NULL,
    `mapId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Land` (
    `id` INTEGER NOT NULL,
    `minted` BOOLEAN NOT NULL,
    `cellId` INTEGER NOT NULL,

    UNIQUE INDEX `Land_id_key`(`id`),
    UNIQUE INDEX `Land_cellId_key`(`cellId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tower` (
    `id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cell` ADD CONSTRAINT `Cell_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Land` ADD CONSTRAINT `Land_cellId_fkey` FOREIGN KEY (`cellId`) REFERENCES `Cell`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
