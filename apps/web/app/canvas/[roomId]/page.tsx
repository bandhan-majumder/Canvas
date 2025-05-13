import RoomCanvas from "@/component/RoomCanvas";
import { getServerSession } from "next-auth";

async function CanvasPage({params}: {params: Promise<{ roomId: string }>}) {
    const session = await getServerSession();

    // TODO: pass the actual token
    const token = session?.user?.email;
    const roomId = (await params).roomId;
    return <RoomCanvas roomId={roomId} token={token}/>
}

export default CanvasPage