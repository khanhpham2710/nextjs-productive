import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteAccountSchema } from "@/schema/deleteAccountSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const { email: userEmail } = session.user;

  const body: unknown = await request.json();
  const result = deleteAccountSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
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

    if (result.data.email != userEmail) {
      return new NextResponse("", {
        status: 403,
        statusText: "Unallow to delete profile",
      });
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
