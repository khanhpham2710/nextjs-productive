-- CreateTable
CREATE TABLE "MindMap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "updatedUserId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "content" JSONB,
    "title" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '1f9e0',

    CONSTRAINT "MindMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MindMapToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MindMapToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "MindMap_workspaceId_idx" ON "MindMap"("workspaceId");

-- CreateIndex
CREATE INDEX "MindMap_updatedUserId_idx" ON "MindMap"("updatedUserId");

-- CreateIndex
CREATE INDEX "MindMap_creatorId_idx" ON "MindMap"("creatorId");

-- CreateIndex
CREATE INDEX "_MindMapToTag_B_index" ON "_MindMapToTag"("B");

-- AddForeignKey
ALTER TABLE "MindMap" ADD CONSTRAINT "MindMap_updatedUserId_fkey" FOREIGN KEY ("updatedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MindMap" ADD CONSTRAINT "MindMap_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MindMap" ADD CONSTRAINT "MindMap_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MindMapToTag" ADD CONSTRAINT "_MindMapToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "MindMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MindMapToTag" ADD CONSTRAINT "_MindMapToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
