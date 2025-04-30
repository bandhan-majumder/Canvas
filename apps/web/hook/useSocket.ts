/*
* Connect to the websocket server once it mounts
*/
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);

    const [socket, setSocket] = useState<WebSocket>();

    // TODO: fix this hardcoded token thing
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=`);

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {socket, loading};
}