import { prisma } from '@/lib/db';
import deleteImages from '@/lib/deleteUploadThing';
import type { NextRequest } from 'next/server';
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const unused = await prisma.additionalResource.findMany({
    where: {
      messageId: null,
      ...(process.env.NODE_ENV === "production"
        ? {
            createdAt: {
              lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
            },
          }
        : {}),
    },
    select: {
      id: true,
      url: true,
    },
  });

  unused.forEach((a)=>{
    deleteImages(a.url)
  })

  await prisma.additionalResource.deleteMany({
    where: {
      id: {
        in: unused.map((a) => a.id),
      },
    },
  });

 
  return Response.json({ success: true });
}