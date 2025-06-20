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
    
    if (!roomSlug) {
        return NextResponse.json("Missing roomId", { status: 400 });
    }

    const roomInfo = await prismaClient.room.findFirst({
        where: {
            slug: roomSlug
        },
    })

    return NextResponse.json({
        roomInfo: roomInfo
    });
}