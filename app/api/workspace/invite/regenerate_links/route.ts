import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    const session = await auth();
  
    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 400,
        statusText: "Unauthorized User",
      });
    }
  
    const body: unknown = await request.json();
    const result = z
      .object({
        id: z.string(),
      })
      .safeParse(body);
  
    if (!result.success) {
      return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
    }
  
    const { id } = result.data;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          subscriptions: {
            where: {
              workspaceId: id,
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
  
      const workspace = await prisma.workspace.update({
        where: {
          id,
        },
        data: {
          inviteCode: uuidv4(),
          adminCode: uuidv4(),
          canEditCode: uuidv4(),
          readOnlyCode: uuidv4(),
        },
      });
  
      return NextResponse.json(workspace, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
    }
  }