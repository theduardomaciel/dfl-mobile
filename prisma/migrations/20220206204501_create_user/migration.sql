-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "google_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
