import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");

  if (!workspaceId)
    return NextResponse.json("ERRORS.NO_WORKSPACE", { status: 404 });

  try {
    const users = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: { workspaceId },
        },
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

    const returnUsers = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        image: user.image,
        userRole: user.subscriptions[0].userRole,
        // lastTimeActive: user.lastTimeActive,
      };
    });

    return NextResponse.json(returnUsers, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};