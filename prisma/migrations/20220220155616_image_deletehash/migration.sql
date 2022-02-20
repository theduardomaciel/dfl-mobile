/*
  Warnings:

  - Added the required column `image_deleteHash` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "image_deleteHash" TEXT NOT NULL;
