import RoomCanvas from "@/component/RoomCanvas";

async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId;
    return <RoomCanvas roomId={roomId}/>
}

export default CanvasPage