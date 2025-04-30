import axios from "axios";
import { BACKEND_URL } from "../app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(slug: string){
    const response = await axios.get(`${BACKEND_URL}/chats/${slug}`);;
    return response.data.chats;
}

export async function ChatRoom({id}: {id: string}){
    const messages = await getChats(id);
    return <ChatRoomClient id={id} messages={messages}/>
}