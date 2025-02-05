import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");

  if (!workspaceId)
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });

  try {
    const tags = await prisma.tag.findMany({
      where: {
        workspaceId,
      },
    });

    if (!tags) return NextResponse.json([], { status: 200 });
    return NextResponse.json(tags, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 404 });
  }
};