-- AlterTable
ALTER TABLE "contact_messages" ADD "reply" TEXT;

-- AlterTable
ALTER TABLE "contact_messages" ADD "repliedAt" DATETIME;

-- AlterTable
ALTER TABLE "contact_messages" ADD "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
