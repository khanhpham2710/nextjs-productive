-- CreateTable
CREATE TABLE "assignedToTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "assignedToTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignedToMindMap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mindMapId" TEXT NOT NULL,

    CONSTRAINT "assignedToMindMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignedToTask" ADD CONSTRAINT "assignedToTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedToTask" ADD CONSTRAINT "assignedToTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedToMindMap" ADD CONSTRAINT "assignedToMindMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignedToMindMap" ADD CONSTRAINT "assignedToMindMap_mindMapId_fkey" FOREIGN KEY ("mindMapId") REFERENCES "MindMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
