import { MESSAGES_LIMIT } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const chatId = url.searchParams.get("chatId");
  const page = url.searchParams.get("page");
  const amountOfNewMessages = url.searchParams.get("amountOfNewMessages");

  if (!userId || !chatId)
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });

  const pageValue = parseInt(page ? page : "1");
  const amountOfNewMessagesValue = parseInt(
    amountOfNewMessages ? amountOfNewMessages : "0"
  );
  const skipValue = MESSAGES_LIMIT * (pageValue - 1) + amountOfNewMessagesValue;

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        additionalResources: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skipValue >= 0 ? skipValue : 0,
      take: MESSAGES_LIMIT,
    });

    if (!messages) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(messages, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 404 });
  }
};