/*
  Warnings:

  - You are about to drop the `ProductHighlight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductHighlight";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductFeatures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "features" TEXT NOT NULL,
    "productId" INTEGER,
    CONSTRAINT "ProductFeatures_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductShipping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipping" TEXT NOT NULL,
    "productId" INTEGER,
    CONSTRAINT "ProductShipping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
