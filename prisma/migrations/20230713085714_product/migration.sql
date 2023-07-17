-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductFeatures" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "features" TEXT NOT NULL,
    "productId" INTEGER,
    CONSTRAINT "ProductFeatures_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductFeatures" ("features", "id", "productId") SELECT "features", "id", "productId" FROM "ProductFeatures";
DROP TABLE "ProductFeatures";
ALTER TABLE "new_ProductFeatures" RENAME TO "ProductFeatures";
CREATE TABLE "new_ProductShipping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipping" TEXT NOT NULL,
    "productId" INTEGER,
    CONSTRAINT "ProductShipping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductShipping" ("id", "productId", "shipping") SELECT "id", "productId", "shipping" FROM "ProductShipping";
DROP TABLE "ProductShipping";
ALTER TABLE "new_ProductShipping" RENAME TO "ProductShipping";
CREATE TABLE "new_Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("id", "productId", "quantity") SELECT "id", "productId", "quantity" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE UNIQUE INDEX "Cart_productId_key" ON "Cart"("productId");
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("alt", "id", "productId", "src") SELECT "alt", "id", "productId", "src" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
