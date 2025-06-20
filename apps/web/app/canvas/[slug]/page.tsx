import { prismaClient } from "@repo/db/client";
import RoomCanvas from "@/component/RoomCanvas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Room404 from "@/component/RoomNotFound";

async function CanvasPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("User not authenticated");
    }

    const slug = (await params).slug;
    if (!slug) {
        throw new Error("Room slug is required");
    }

    try {
        const roomInfo = await prismaClient.room.findFirst({
            where: {
                slug: slug
            },
        });
        const user = session.user;

        if(!roomInfo) {
            throw new Error("Room not found");
        }
        
        return <RoomCanvas roomId={roomInfo.id.toString()} userInfo={user} />;
    } catch (error) {
        return <Room404 />;
    }
}

export default CanvasPage;