import RoomCanvas from "@/component/RoomCanvas";
import { getServerSession } from "next-auth";

async function CanvasPage({params}: {params: Promise<{ roomId: string }>}) {
    const session = await getServerSession();

    if (!session?.user) {
        throw new Error("User not authenticated");
    }

    const roomId = (await params).roomId;
    const user = session.user;
    return <RoomCanvas roomId={roomId} userInfo={user}/>
}

export default CanvasPage