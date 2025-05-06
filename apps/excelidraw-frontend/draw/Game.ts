import { Shape } from "@/types/shape";
import { getExistingShape } from "./http";
import { Tool } from "@/types/tools";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tool = Tool.Square; // by default, select square

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        // getContext can be null. with "!" , we are making sure that it's not null while getting assigned. Typescript is omiting the "null" type
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    setTool(tool: Tool) {
        this.selectedTool = tool
    }

    async init() {
        this.existingShapes = await getExistingShape(this.roomId);
        this.clearAndRenderCanvas();
    }

    clearAndRenderCanvas() {
        // clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // render
        this.existingShapes.map(shape => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            }
            if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        })
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape)
                this.clearAndRenderCanvas();
            }
        }
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false

        // calculate the width and the height
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        let shape: Shape | null = null;

        if (this.selectedTool === Tool.Square) {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (this.selectedTool === Tool.Circle) {
            const radius = Math.abs(Math.max(width, height) / 2);
            shape = {
                type: "circle",
                radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius
            }

        } 
        else if (this.selectedTool === Tool.Line) {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            }
        }

        if (!shape) return;

        this.existingShapes.push(shape);

        // also send it to the backend when the mouse ups
        this.socket.send(JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify({
                ...shape
            })
        }))
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearAndRenderCanvas();

            this.ctx.strokeStyle = "rgba(255, 255, 255)"

            if (this.selectedTool === Tool.Square) {
                this.ctx.strokeRect(this.startX, this.startY, width, height)
            }
            else if (this.selectedTool === Tool.Circle) {
                const radius = Math.abs(Math.max(width, height) / 2);
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } 
            else if (this.selectedTool === Tool.Line) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }
}