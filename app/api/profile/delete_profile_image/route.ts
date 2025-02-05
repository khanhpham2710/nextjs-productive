import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import deleteImages from "@/lib/deleteUploadThing";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

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

    if (user.image && user.image.includes("utfs.io")){
      const result = await deleteImages(user.image)
      if (!result.success){
        return NextResponse.json("ERRORS.IMAGE_PROFILE_DELETE", { status: 405 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: null,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}