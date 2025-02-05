import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const url = new URL(request.url);
  
    const userId = url.searchParams.get("userId");
  
    if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });
  
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          NOT: { userRole: "READ_ONLY" },
        },
        include: {
          workspace: true,
        },
      });
  
      const workspaces = subscriptions.map(
        (subscription) => subscription.workspace
      );
  
      if (!workspaces) return NextResponse.json([], { status: 200 });
  
      return NextResponse.json(workspaces, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
    }
  };