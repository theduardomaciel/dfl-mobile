/*
  Warnings:

  - You are about to drop the column `ratings` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "ratings" JSONB[];

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "ratings",
ADD COLUMN     "note1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note2" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note3" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note4" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note5" INTEGER NOT NULL DEFAULT 0;
