import { isRoomSharing, stopSharingRoom } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        const isShared = await isRoomSharing(roomId);

        return NextResponse.json({ isShared });
    } catch (error) {
        console.error("Error checking share status:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        await stopSharingRoom(roomId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error stopping share:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
