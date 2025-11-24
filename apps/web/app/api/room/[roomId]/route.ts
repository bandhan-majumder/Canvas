import { getElementsByRoomId, updateRoomElements } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        const elements = await getElementsByRoomId(roomId);

        if (!elements) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ elements });
    } catch (error) {
        console.error("Error fetching room elements:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        const body = await request.json();
        const { elements } = body;

        await updateRoomElements(roomId, elements);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating room elements:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
