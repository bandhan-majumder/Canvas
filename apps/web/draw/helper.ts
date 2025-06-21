export async function getExistingShape(roomId: string) {
    const response = await fetch(`/api/shapes?roomId=${roomId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch existing shapes");
    }
    const data = await response.json();
    const messages = data.shapes || [];

    const shapes = messages.map((msg: { object: string }) => {
        try {
            const messageData = JSON.parse(msg.object);
            return messageData;
        } catch (error) {
            console.log("Error parsing object data: ", error);
        }
    })

    return shapes;
}

export async function getRoomInfo(slug: string) {
    const response = await fetch(`/api/room?slug=${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch room info");
    }
    const data = await response.json();
    return data;
}