-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WhatsappSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT,
    "message" TEXT,
    "includeProductLink" BOOLEAN NOT NULL DEFAULT false,
    "showClose" BOOLEAN NOT NULL DEFAULT true,
    "buttonSize" TEXT NOT NULL DEFAULT 'S',
    "buttonLabel" TEXT,
    "showDelaySeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WhatsappSettings" ("buttonLabel", "buttonSize", "createdAt", "message", "phone", "shop", "showClose", "showDelaySeconds", "updatedAt") SELECT "buttonLabel", "buttonSize", "createdAt", "message", "phone", "shop", "showClose", "showDelaySeconds", "updatedAt" FROM "WhatsappSettings";
DROP TABLE "WhatsappSettings";
ALTER TABLE "new_WhatsappSettings" RENAME TO "WhatsappSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
