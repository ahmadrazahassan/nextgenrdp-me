-- CreateEnum
-- CREATE TYPE "MediaStatus" AS ENUM ('approved', 'pending', 'rejected', 'flagged');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "thumbnailPath" TEXT NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'pending',
    "tags" JSONB NOT NULL,
    "orderId" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
