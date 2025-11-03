import { Shape } from "@/types/shape";
import { getExistingShape } from "./helper";
import { Tool } from "@/types/tools";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  // private roomId: string;
  // private socket: WebSocket;
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private scale: number = 1; // Initialize scale to 1
  private scaleMultiplier = 0.8;
  private selectedTool: Tool | undefined; // by default, select square
  private maxZoomout = 0.26214400000000015;
  private maxZoomin = 3.814697265625;

  constructor(canvas: HTMLCanvasElement) {
    // roomId: string, socket: WebSocket
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    // this.roomId = roomId;
    // this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    // this.existingShapes = await getExistingShape(this.roomId);
    this.clearAndRenderCanvas();
  }

  clearAndRenderCanvas() {
    if (!this.canvas || !this.ctx) return;

    // Save the current transformation
    this.ctx.save();

    // Reset transformations
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(17, 16, 17)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply the scale transformation
    // Scale from the center of the canvas
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-centerX, -centerY);

    // Draw shapes
    this.ctx.strokeStyle = "rgba(255, 255, 255)";

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });

    // Restore the saved transformation
    this.ctx.restore();
  }

  initHandlers() {
    // this.socket.onmessage = (event) => {
    //   const parsedData = JSON.parse(event.data);

    //   if (parsedData.type === "chat") {
    //     const parsedShape = JSON.parse(parsedData.object);
    //     this.existingShapes.push(parsedShape);
    //     this.clearAndRenderCanvas();
    //   }
    // };
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  // Convert canvas coordinates to world coordinates
  getWorldCoordinates(
    canvasX: number,
    canvasY: number,
  ): { x: number; y: number } {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Reverse the transformation
    const worldX = (canvasX - centerX) / this.scale + centerX;
    const worldY = (canvasY - centerY) / this.scale + centerY;

    return { x: worldX, y: worldY };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;

    // Get the position relative to the canvas
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
    this.startX = worldCoords.x;
    this.startY = worldCoords.y;
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    // If we didn't actually move, don't create a shape
    if (e.clientX === this.startX && e.clientY === this.startY) {
      return;
    }

    // Get the position relative to the canvas
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
    const endX = worldCoords.x;
    const endY = worldCoords.y;

    // Calculate the width and the height
    const width = endX - this.startX;
    const height = endY - this.startY;

    let shape: Shape | null = null;

    if (this.selectedTool === Tool.Square) {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (this.selectedTool === Tool.Circle) {
      const radius = Math.abs(Math.max(width, height) / 2);
      shape = {
        type: "circle",
        radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      };
    } else if (this.selectedTool === Tool.Line) {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: endX,
        endY: endY,
      };
    }

    if (!shape) return;

    this.existingShapes.push(shape);

    // Also send it to the backend when the mouse ups
    // this.socket.send(
    //   JSON.stringify({
    //     type: "chat",
    //     roomId: this.roomId,
    //     object: JSON.stringify({
    //       ...shape,
    //     }),
    //   }),
    // );

    this.clearAndRenderCanvas();
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      // Get the position relative to the canvas
      const rect = this.canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      // Convert to world coordinates
      const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
      const currentX = worldCoords.x;
      const currentY = worldCoords.y;

      const width = currentX - this.startX;
      const height = currentY - this.startY;

      this.clearAndRenderCanvas();

      // Save the current transformation
      this.ctx.save();

      // Apply the same transformation used in clearAndRenderCanvas
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      this.ctx.translate(centerX, centerY);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.translate(-centerX, -centerY);

      this.ctx.strokeStyle = "rgba(255, 255, 255)";

      if (this.selectedTool === Tool.Square) {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool === Tool.Circle) {
        const radius = Math.abs(Math.max(width, height) / 2);
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === Tool.Line) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        this.ctx.closePath();
      }

      // Restore the saved transformation
      this.ctx.restore();
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  zoomInHandler = () => {
    this.scale /= this.scaleMultiplier;
    this.scale > this.maxZoomin && (this.scale = this.maxZoomin);

    // Redraw the canvas with the new scale
    this.clearAndRenderCanvas();
  };

  zoomOutHandler = () => {
    this.scale *= this.scaleMultiplier;
    this.scale < this.maxZoomout && (this.scale = this.maxZoomout);

    // Redraw the canvas with the new scale
    this.clearAndRenderCanvas();
  };
}
