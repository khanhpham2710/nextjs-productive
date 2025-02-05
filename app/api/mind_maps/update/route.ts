import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mindMapSchema } from "@/schema/mindMapSchema";
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
  const result = mindMapSchema.safeParse(body);


  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, content, mindMapId } = result.data;

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

    const mindMap = await prisma.mindMap.findUnique({
      where: {
        id: mindMapId,
      },
    });

    if (!mindMap)
      return NextResponse.json("ERRORS.NO_MIND_MAP_FOUND", { status: 404 });

    const updatedMindMap = await prisma.mindMap.update({
      where: {
        id: mindMap.id,
      },
      data: {
        updatedUserId: session.user.id,
        content,
      },
    });

    return NextResponse.json(updatedMindMap, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}