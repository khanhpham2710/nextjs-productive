import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    workspace_id: string;
  }>;
}

export const GET = async (
  request: Request,
  { params }: Params
) => {
    const { workspace_id } = await params
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
      include: {
        subscribers: {
          select: {
            userRole: true,
            user: {
              select: {
                id: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            user: {
              surname: "desc",
            },
          },
        },
        tasks: {
          orderBy: {
            taskDate: {
              from: 'asc'
            }
          }
        }
      },
    });

    if (!workspace)
      return NextResponse.json("Workspace not found", { status: 404 });

    return NextResponse.json(workspace, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};