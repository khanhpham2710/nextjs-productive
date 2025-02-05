import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateTaskDateSchema } from "@/schema/updateTaskSchema";
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

  const result = updateTaskDateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { date, taskId, workspaceId } = result.data;

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

    if (!task) {
      return NextResponse.json("ERRORS.NO_TASK_FOUND", { status: 404 });
    }

    await prisma.taskDate.update({
      where: {
        id: task.taskDate?.id,
      },
      data: {
        from: date?.from ? date.from : null,
        to: date?.to ? date.to : null,
      },
    });

    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        updatedUserId: session.user.id,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}