-- CreateTable
CREATE TABLE "Map" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "multiplierId" INTEGER NOT NULL,
    CONSTRAINT "Map_multiplierId_fkey" FOREIGN KEY ("multiplierId") REFERENCES "Multiplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Multiplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
