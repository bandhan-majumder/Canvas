/*
 * Connect to the websocket server once it mounts
 */
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);

  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=${localStorage.getItem("authToken")}`,
    );

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { socket, loading };
}
