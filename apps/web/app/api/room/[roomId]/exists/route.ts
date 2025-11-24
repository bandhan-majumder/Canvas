import { roomExists } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        const { roomId } = await params;
        const exists = await roomExists(roomId);

        return NextResponse.json({ exists });
    } catch (error) {
        console.error("Error checking room existence:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
