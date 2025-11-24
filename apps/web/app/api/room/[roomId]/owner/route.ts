import { isRoomOwner } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 },
            );
        }

        const isOwner = await isRoomOwner(roomId, username);

        return NextResponse.json({ isOwner });
    } catch (error) {
        console.error("Error checking room ownership:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
