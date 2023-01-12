-- CreateTable
CREATE TABLE `User` (
    `address` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_address_key`(`address`),
    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `type` ENUM('FIRE', 'ICE', 'JUNGLE') NULL,
    `damageBonus` INTEGER NULL,
    `imgUrl` VARCHAR(191) NULL,

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
    `owner` VARCHAR(191) NOT NULL,

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
    `type` ENUM('FIRE', 'ICE', 'JUNGLE') NOT NULL,
    `imgUrl` VARCHAR(191) NULL,

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
