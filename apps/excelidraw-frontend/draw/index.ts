import { HTTP_BACKEND_URL } from "@/config";
import { Tool } from "@/types/tools";
import axios from "axios";
import { Shape } from "@/types/shape";

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

        // @ts-ignore
        const selectedTool = window.selectedTool;

        let shape: Shape | null = null;

        if (selectedTool === Tool.Square) {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        } else if (selectedTool === Tool.Circle) {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius,
                centerX: startX + radius,
                centerY: startY + radius
            }

        }

        if (!shape) return;

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

            //@ts-ignore
            const selectedTool = window.selectedTool;

            if (selectedTool === Tool.Square) {
                ctx.strokeRect(startX, startY, width, height)
            }
            else if (selectedTool === Tool.Circle) {
                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
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
        if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
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