import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { accountInfoSettingsSchema } from "@/schema/accountInfoSettingSchema";
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

  const result = accountInfoSettingsSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { username, name, surname } = result.data;

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

    const existedUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existedUsername && existedUsername.id !== user.id)
      return NextResponse.json("ERRORS.TAKEN_USERNAME", { status: 402 });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        surname,
        username,
      },
    });

    return NextResponse.json(result.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}