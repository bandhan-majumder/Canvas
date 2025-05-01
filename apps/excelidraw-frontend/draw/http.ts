import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShape(roomId: string) {
    const response = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);

    // if there are no existing shapes
    const messages = response.data.chats || [];

    const shapes = messages.map((msg: { message: string }) => {
        const messageData = JSON.parse(msg.message);
        return messageData;
    })

    return shapes;
}