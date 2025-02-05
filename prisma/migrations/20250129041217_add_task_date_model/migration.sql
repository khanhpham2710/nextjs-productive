-- CreateTable
CREATE TABLE "TaskDate" (
    "id" TEXT NOT NULL,
    "from" TEXT,
    "to" TEXT,

    CONSTRAINT "TaskDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "TaskDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
