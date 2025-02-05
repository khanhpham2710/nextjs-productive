import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteTaskSchema } from "@/schema/taskSchema";import { NotifyType } from "@prisma/client";
;
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body = await request.json();

  const result = deleteTaskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, taskId } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: {
          where: {
            workspaceId: workspaceId,
          },
          select: {
            userRole: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    if (user.subscriptions[0].userRole === "READ_ONLY") {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskDate: true,
      },
    });

    if (!task)
      return NextResponse.json("ERRORS.NO_TASK_FOUND", { status: 404 });

    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        workspaceId,
        taskId: task.id,
        notifyType: NotifyType.NEW_TASK,
      },
    });

    return NextResponse.json("ok", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}