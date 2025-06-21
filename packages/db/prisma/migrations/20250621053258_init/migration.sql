-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "canvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shape" (
    "id" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "canvas_slug_key" ON "canvas"("slug");

-- CreateIndex
CREATE INDEX "canvas_userId_idx" ON "canvas"("userId");

-- CreateIndex
CREATE INDEX "shape_canvasId_idx" ON "shape"("canvasId");

-- CreateIndex
CREATE INDEX "shape_userId_idx" ON "shape"("userId");

-- AddForeignKey
ALTER TABLE "canvas" ADD CONSTRAINT "canvas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shape" ADD CONSTRAINT "shape_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shape" ADD CONSTRAINT "shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
