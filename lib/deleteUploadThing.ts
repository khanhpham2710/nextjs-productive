import { UTApi } from "uploadthing/server";

const deleteImages = async (
  URLs: string | string[]
): Promise<{
  success: boolean;
  deletedCount: number;
}> => {
  const ids = Array.isArray(URLs)
    ? URLs.map((url) => url.split(`/f/`)[1])
    : [URLs.split(`/f/`)[1]];

  const result = await new UTApi().deleteFiles(ids);

  return {
    success: result.success,
    deletedCount: result.deletedCount,
  };
};


export default deleteImages;