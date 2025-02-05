import { signUpSchema } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("Missing fields, Wrong Data", { status: 203 });
  }

  const { email, password, username } = result.data;

  try {
    const existedUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existedUsername)
      return NextResponse.json("ERRORS.TAKEN_USERNAME", { status: 202 });

    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser)
      return NextResponse.json("ERRORS.TAKEN_EMAIL", { status: 201 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword
      },
    });

    return NextResponse.json(newUser, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DEFAULT", { status: 204 });
  }
}