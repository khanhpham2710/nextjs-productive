import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    mind_map_id: string;
  }>;
}

export const GET = async (request: Request, { params }: Params) => {
  const { mind_map_id } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

  try {
    const mindMap = await prisma.mindMap.findUnique({
      where: {
        id: mind_map_id,
      },
      include: {
        tags: true,
        savedMindMaps: true,
        creator: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
            surname: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    if (!mindMap)
      return NextResponse.json("ERRORS.NO_MIND_MAP_FOUND", { status: 200 });
    return NextResponse.json(mindMap, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 404 });
  }
};
