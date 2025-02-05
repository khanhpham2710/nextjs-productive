import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { newMessageSchema } from "@/schema/messageSchema";

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

  const result = newMessageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const newMessage = result.data;

  if (
    newMessage.content.length === 0 &&
    newMessage.additionalResources.length === 0
  ) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  try {
    const chat = await prisma.conversation.findUnique({
      where: {
        id: newMessage.conversationId,
      },
    });

    if (!chat) return NextResponse.json("ERRORS.NO_CHAT", { status: 404 });

    await prisma.message.create({
      data: {
        id: newMessage.id,
        senderId: session.user.id,
        content: newMessage.content,
        conversationId: newMessage.conversationId,
        edited: false,
      },
    });

    if (newMessage.additionalResources.length > 0) {
      for (const attachment of newMessage.additionalResources) {
        await prisma.additionalResource.update({
          where:{
            id: attachment.id
          },
          data: {
            messageId: newMessage.id,
          },
        });
      }
    }

    return NextResponse.json("ok", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}