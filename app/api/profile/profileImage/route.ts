import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import deleteImages from "@/lib/deleteUploadThing";
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
      profileImage: z.string(),
    })
    .safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { profileImage } = result.data;

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

    if (user.image) {
      const result = await deleteImages(user.image);
      if (!result.success) {
        throw new Error("ERRORS.IMAGE_PROFILE_UPDATE");
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: profileImage,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
