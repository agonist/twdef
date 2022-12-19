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
CREATE TABLE `InGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `towerId` INTEGER NOT NULL,
    `landId` INTEGER NOT NULL,
    `mapId` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,

    UNIQUE INDEX `InGame_towerId_key`(`towerId`),
    UNIQUE INDEX `InGame_landId_key`(`landId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tower` (
    `id` INTEGER NOT NULL,
    `damage` INTEGER NOT NULL,
    `speed` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `type` ENUM('REGULAR', 'FIRE') NOT NULL,

    UNIQUE INDEX `Tower_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `count` INTEGER NOT NULL,
    `multiplier` DOUBLE NOT NULL,
    `mapId` INTEGER NOT NULL,

    UNIQUE INDEX `Wave_mapId_key`(`mapId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cell` ADD CONSTRAINT `Cell_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Land` ADD CONSTRAINT `Land_cellId_fkey` FOREIGN KEY (`cellId`) REFERENCES `Cell`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InGame` ADD CONSTRAINT `InGame_towerId_fkey` FOREIGN KEY (`towerId`) REFERENCES `Tower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InGame` ADD CONSTRAINT `InGame_landId_fkey` FOREIGN KEY (`landId`) REFERENCES `Land`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InGame` ADD CONSTRAINT `InGame_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wave` ADD CONSTRAINT `Wave_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
