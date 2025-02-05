import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 2 } })
    .middleware(async () => {
      const session = await auth();

      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async () => {}),

  addToChatFile: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 5 },
    image: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
