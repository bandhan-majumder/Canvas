import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws, request) => {
    const url = request.url;

    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ??  "";
    const decoded = jwt.verify(token, JWT_SECRET);

    if ( typeof decoded === "string"){
        return;
    }

    if(!decoded || !decoded.userId){ // !(decoded as JwtPayload)
        ws.close(); // close the connection
        return;
    }

    ws.on('message', (data) => {
        ws.send("ping")
    })
})