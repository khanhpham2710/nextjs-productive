import { changePasswordSchema } from "@/schema/changePasswordSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

  const result = changePasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { new_password, current_password } = result.data;

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

    if (!user.hashedPassword)
      return new NextResponse("ERRORS.NO_PASSWORD", { status: 406 });

    const passwordMatch = await bcrypt.compare(
      current_password,
      user.hashedPassword
    );
    if (!passwordMatch)
      return new NextResponse("ERRORS.PASSWORD_MISMATCH", { status: 402 });

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        hashedPassword,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}