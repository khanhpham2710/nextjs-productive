import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

  try {
    const pomodoroSettings = await prisma.pomodoroSettings.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!pomodoroSettings)
      return NextResponse.json("ERRORS.NO_POMODORO_FOUND", { status: 200 });

    return NextResponse.json(pomodoroSettings, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};