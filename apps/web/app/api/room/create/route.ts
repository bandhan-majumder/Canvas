import { createRoomWithElements } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { savedElements, userName } = body;

        const roomId = await createRoomWithElements({ savedElements, userName });

        if (!roomId) {
            return NextResponse.json(
                { error: "Failed to create room" },
                { status: 500 },
            );
        }

        return NextResponse.json({ roomId });
    } catch (error) {
        console.error("Error in create room API:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
