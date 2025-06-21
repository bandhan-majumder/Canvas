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
    const roomId = searchParams.get("roomId");
    
    if (!roomId) {
        return NextResponse.json("Missing roomId", { status: 400 });
    }

    const allExistingShapes = await prismaClient.shape.findMany({
        where: {
            canvasId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    return NextResponse.json({
        shapes: allExistingShapes
    });
}