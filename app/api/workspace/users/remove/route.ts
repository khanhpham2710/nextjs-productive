import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteUserFromWorkspaceSchema } from "@/schema/deleteUserFromWorkspaceSchema";
import { NotifyType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await auth();
  
    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 400,
        statusText: "Unauthorized User",
      });
    }
  
    const body: unknown = await request.json();
    const result = deleteUserFromWorkspaceSchema.safeParse(body);
  
    if (!result.success) {
      return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
    }
  
    const { userId, workspaceId } = result.data;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          subscriptions: {
            where: {
              workspaceId,
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
  
      if (
        user.subscriptions[0].userRole === "CAN_EDIT" ||
        user.subscriptions[0].userRole === "READ_ONLY"
      ) {
        return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
      }
  
      await prisma.subscription.delete({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });
  
      const workspaceUsers = await prisma.subscription.findMany({
        where: {
          workspaceId,
        },
        select: {
          userId: true,
        },
      });
  
      const notificationsData = workspaceUsers.map((user) => ({
        notifyCreatorId: session.user.id,
        userId: user.userId,
        workspaceId,
        notifyType: NotifyType.USER_LEFT_WORKSPACE,
      }));
  
      await prisma.notification.createMany({
        data: notificationsData,
      });
  
      return NextResponse.json("OK", { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
    }
  }