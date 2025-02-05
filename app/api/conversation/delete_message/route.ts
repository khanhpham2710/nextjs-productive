import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteMessageSchema } from "@/schema/messageSchema";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body= await request.json();

  const result = deleteMessageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { id } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) return NextResponse.json("ERRORS.NO_MESSAGE", { status: 404 });

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json("ok", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}