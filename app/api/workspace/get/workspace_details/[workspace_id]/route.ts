import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: {
    workspace_id: string;
  };
}

export const GET = async (request: Request, { params }: Params) => {
  const { workspace_id } = await params;
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

  try {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspace_id,
        subscribers: {
          some: {
            userId,
          },
        },
      },
    });

    if (!workspace)
      return NextResponse.json("Workspace not found", { status: 200 });

    return NextResponse.json(workspace, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};
