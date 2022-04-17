/*
  Warnings:

  - You are about to drop the column `commentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `profileUsername` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `profile_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_profileUsername_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reportId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commentId",
DROP COLUMN "profileUsername",
DROP COLUMN "reportId",
ADD COLUMN     "profile_id" INTEGER NOT NULL,
ADD COLUMN     "report_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
