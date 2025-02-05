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

  const body = await request.json();
  const result = z
    .object({
      id: z.string(),
    })
    .safeParse(body);

  if (!result.success)
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });

  const { id } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    await prisma.notification.deleteMany({
      where: {
        id,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}