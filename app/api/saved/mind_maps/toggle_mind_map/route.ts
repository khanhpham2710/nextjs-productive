import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const taskSchema = z.object({
    mindMapId: z.string(),
  });

  const body: unknown = await request.json();

  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { mindMapId } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        savedMindMaps: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    const existSavedMindMap = user.savedMindMaps.find(
      (mindMap) => mindMap.mindMapId === mindMapId
    );

    if (existSavedMindMap) {
      await prisma.savedMindMaps.delete({
        where: {
          id: existSavedMindMap.id,
        },
      });
    } else {
      await prisma.savedMindMaps.create({
        data: {
          user: { connect: { id: session.user.id } },
          mindMap: { connect: { id: mindMapId } },
        },
      });
    }

    return NextResponse.json("ok", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}