
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pomodoroSettingsSchema } from "@/schema/pomodoroSettingsSchema";
import { PomodoroSoundEffect } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();

  const result = pomodoroSettingsSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const {
    longBreakDuration,
    longBreakInterval,
    rounds,
    shortBreakDuration,
    workDuration,
    soundEffect,
    soundEffectVolume,
  } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        pomodoroSettings: {
          select: {
            userId: true,
            id: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    const pomodoro = user.pomodoroSettings.find(
      (settings) => settings.userId === user.id
    );

    if (!pomodoro) {
      await prisma.pomodoroSettings.create({
        data: {
          userId: user.id,
          longBreakDuration,
          longBreakInterval,
          rounds,
          shortBreakDuration,
          workDuration,
          soundEffect: soundEffect as PomodoroSoundEffect,
          soundEffectVolume: soundEffectVolume / 100,
        },
      });
      return NextResponse.json("OK", { status: 200 });
    } else {
      await prisma.pomodoroSettings.update({
        where: {
          id: pomodoro.id,
        },
        data: {
          longBreakDuration,
          longBreakInterval,
          rounds,
          shortBreakDuration,
          workDuration,
          soundEffect: soundEffect as PomodoroSoundEffect,
          soundEffectVolume: soundEffectVolume / 100,
        },
      });
    }

    return NextResponse.json("OK", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}