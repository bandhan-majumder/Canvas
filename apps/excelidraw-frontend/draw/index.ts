import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}
export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    // get the context
    const ctx = canvas.getContext('2d');

    let existingShapes: Shape[] = await getExistingShape(roomId);

    if (!ctx) {
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape)
            clearAndRenderCanvas(existingShapes, ctx, canvas);
        }
    }

    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // startX endY width height
    // ctx.strokeRect(25,25,100,100)
    clearAndRenderCanvas(existingShapes, ctx, canvas);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;

        clicked = true;
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false

        // calculate the width and the height
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            height,
            width
        }
        existingShapes.push(shape);

        // also send it to the backend when the mouse ups
        socket.send(JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({
                ...shape
            })
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            clearAndRenderCanvas(existingShapes, ctx, canvas);

            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height)
        }
    })
}

function clearAndRenderCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // render
    existingShapes.map(shape => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}

async function getExistingShape(roomId: string) {
    const response = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);

    // if there are no existing shapes
    const messages = response.data.chats || [];

    const shapes = messages.map((msg: { message: string }) => {
        const messageData = JSON.parse(msg.message);
        return messageData;
    })

    return shapes;
}