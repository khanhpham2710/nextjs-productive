import { prisma } from "@/lib/db";
import { onboardingSchema } from "@/schema/onboarding/onboardingSchema";
import { NextResponse } from "next/server";
import { UseCase as UseCaseType } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { getRandomWorkspaceColor } from "@/lib/getRandomWorkspaceColor";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body = await request.json();

  const result = onboardingSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { useCase, workspaceName, name, surname, workspaceImage } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("ERRORS.NO_USER_API", {
        status: 404,
        statusText: "User not Found",
      });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        completedOnboarding: true,
        name,
        surname,
        useCase: useCase as UseCaseType,
      },
    });

    const workspace = await prisma.workspace.create({
      data: {
        creatorId: user.id,
        name: workspaceName,
        image: workspaceImage,
        inviteCode: uuidv4(),
        adminCode: uuidv4(),
        canEditCode: uuidv4(),
        readOnlyCode: uuidv4(),
        color: getRandomWorkspaceColor(),
      },
    });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        userRole: "OWNER",
      },
    });

    await prisma.pomodoroSettings.create({
      data: {
        userId: user.id,
      },
    });

    await prisma.conversation.create({
      data: {
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}