/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToReport` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `defaultCity` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToReport" DROP CONSTRAINT "_CategoryToReport_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToReport" DROP CONSTRAINT "_CategoryToReport_B_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_user_id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "bio",
DROP COLUMN "id",
ADD COLUMN     "defaultCity" TEXT NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("username");

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "published",
ADD COLUMN     "ratings" DOUBLE PRECISION[],
ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "_CategoryToReport";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profileUsername_fkey" FOREIGN KEY ("profileUsername") REFERENCES "Profile"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
