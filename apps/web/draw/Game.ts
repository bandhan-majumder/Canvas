import { CanvasElement } from "@/types/shape";
import { Tool } from "@/types/tools";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: CanvasElement[];
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private scale: number = 1;
  private scaleMultiplier = 0.8;
  private selectedTool: Tool | undefined;
  private maxZoomout = 0.26214400000000015;
  private maxZoomin = 8.0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private onShapeAdded?: (shape: CanvasElement) => void;

  constructor(
    canvas: HTMLCanvasElement,
    initialShapes: CanvasElement[] = [],
    onShapeAdded?: (shape: CanvasElement) => void,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = initialShapes;
    this.onShapeAdded = onShapeAdded;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  updateShapes(shapes: CanvasElement[]) {
    this.existingShapes = shapes;
    this.clearAndRenderCanvas();
  }

  async init() {
    this.clearAndRenderCanvas();
  }

  panCamera(deltaX: number, deltaY: number): void {
    this.offsetX -= deltaX;
    this.offsetY -= deltaY;
    this.clearAndRenderCanvas();
  }

  clearAndRenderCanvas() {
    if (!this.canvas || !this.ctx) return;

    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(18,18,18)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-centerX, -centerY);
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.strokeStyle = "rgb(211,211,211)";

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
      } 
      else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      }
      else if (shape.type === "diamond") {
        this.drawDiamond(shape.centerX, shape.centerY, shape.width, shape.height);
      }
    });

    this.ctx.restore();
  }

  drawDiamond(x: number, y: number, width: number, height: number) {
    const midX = x + width / 2;
    const midY = y + height / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(midX, y);                // top
    this.ctx.lineTo(x + width, midY);        // right
    this.ctx.lineTo(midX, y + height);       // bottom
    this.ctx.lineTo(x, midY);                // left
    this.ctx.closePath();
    this.ctx.stroke();
  }

  initHandlers() {}

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  getWorldCoordinates(canvasX: number, canvasY: number): { x: number; y: number } {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const worldX = (canvasX - centerX) / this.scale + centerX - this.offsetX;
    const worldY = (canvasY - centerY) / this.scale + centerY - this.offsetY;

    return { x: worldX, y: worldY };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
    this.startX = worldCoords.x;
    this.startY = worldCoords.y;
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
    const endX = worldCoords.x;
    const endY = worldCoords.y;

    if (Math.abs(endX - this.startX) < 1 && Math.abs(endY - this.startY) < 1) {
      return;
    }

    const width = endX - this.startX;
    const height = endY - this.startY;

    let shape: CanvasElement | null = null;

    if (this.selectedTool === Tool.Square) {
      shape = { type: "rect", x: this.startX, y: this.startY, width, height };
    } 
    else if (this.selectedTool === Tool.Circle) {
      const radius = Math.sqrt(width * width + height * height) / 2;
      shape = {
        type: "circle",
        radius,
        centerX: (this.startX + endX) / 2,
        centerY: (this.startY + endY) / 2,
      };
    } 
    else if (this.selectedTool === Tool.Line) {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX,
        endY,
      };
    } 
    else if (this.selectedTool === Tool.Diamond) {
      shape = {
        type: "diamond",
        centerX: this.startX,
        centerY: this.startY,
        width,
        height,
      };
    }

    if (!shape) return;

    if (this.onShapeAdded) {
      this.onShapeAdded(shape);
      this.clearAndRenderCanvas();
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const worldCoords = this.getWorldCoordinates(canvasX, canvasY);
    const currentX = worldCoords.x;
    const currentY = worldCoords.y;

    const width = currentX - this.startX;
    const height = currentY - this.startY;

    this.clearAndRenderCanvas();

    this.ctx.save();

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-centerX, -centerY);
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.strokeStyle = "rgb(211,211,211)";

    if (this.selectedTool === Tool.Square) {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } 
    else if (this.selectedTool === Tool.Circle) {
      const radius = Math.sqrt(width * width + height * height) / 2;
      const cx = (this.startX + currentX) / 2;
      const cy = (this.startY + currentY) / 2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    } 
    else if (this.selectedTool === Tool.Line) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
    } 
    else if (this.selectedTool === Tool.Diamond) {
      this.drawDiamond(this.startX, this.startY, width, height);
    }

    this.ctx.restore();
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  zoomInHandler = () => {
    this.scale /= this.scaleMultiplier;
    if (this.scale > this.maxZoomin) this.scale = this.maxZoomin;
    this.clearAndRenderCanvas();
  };

  zoomOutHandler = () => {
    this.scale *= this.scaleMultiplier;
    if (this.scale < this.maxZoomout) this.scale = this.maxZoomout;
    this.clearAndRenderCanvas();
  };
}
