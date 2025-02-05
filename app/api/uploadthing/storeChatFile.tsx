"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdditionalResource } from "@/types/extended";
import { AdditionalResourceTypes } from "@prisma/client";
import { ClientUploadedFileData } from "uploadthing/types";
import { v4 as uuidv4 } from "uuid";

export default async function storeChatFile(
    result: ClientUploadedFileData<null>
  ): Promise<AdditionalResource> {
    const session = await auth()

    if (!session?.user) {
      throw new Error("Unauthenticated")
    }
  
    const additionalResource = await prisma.additionalResource.create({
      data: {
        id: uuidv4(),
        name: result.name,
        type: result.name.endsWith(".pdf")
          ? AdditionalResourceTypes.PDF
          : AdditionalResourceTypes.IMAGE,
        url: result.url,
      },
    });
  
    return {
      id: additionalResource.id,
      name: additionalResource.name,
      url: additionalResource.url,
      type: additionalResource.type,
    };
  }