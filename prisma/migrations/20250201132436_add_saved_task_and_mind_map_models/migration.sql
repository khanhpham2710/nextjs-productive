-- CreateTable
CREATE TABLE "savedTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "savedTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savedMindMaps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mindMapId" TEXT NOT NULL,

    CONSTRAINT "savedMindMaps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedTask" ADD CONSTRAINT "savedTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedTask" ADD CONSTRAINT "savedTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedMindMaps" ADD CONSTRAINT "savedMindMaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedMindMaps" ADD CONSTRAINT "savedMindMaps_mindMapId_fkey" FOREIGN KEY ("mindMapId") REFERENCES "MindMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
