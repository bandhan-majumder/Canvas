import { authOptions } from "@/lib/auth";
import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const roomSlug = searchParams.get("slug");

  // If no slug is provided, return all room information
  if (!roomSlug) {
    const allRoomInfo = await prismaClient.canvas.findMany();
    return NextResponse.json(allRoomInfo, { status: 200 });
  }

  const roomInfo = await prismaClient.canvas.findFirst({
    where: {
      slug: roomSlug,
    },
  });

  return NextResponse.json({
    roomInfo: roomInfo,
  });
}
