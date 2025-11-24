import { Tool } from "@/types/tools";
import { Minus, Square, Circle, Diamond } from "lucide-react";
import { IconButton } from "./IconButton";

// Desktop Tools Bar
export function ToolsBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="bg-[#232329] p-2 rounded-xl shadow-lg shadow-">
      <div className="flex gap-2">
        <IconButton
          icon={<Square />}
          onClick={() => setSelectedTool(Tool.Square)}
          activated={selectedTool === Tool.Square}
        />
        <IconButton
          icon={<Diamond />}
          onClick={() => setSelectedTool(Tool.Diamond)}
          activated={selectedTool === Tool.Diamond}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => setSelectedTool(Tool.Circle)}
          activated={selectedTool === Tool.Circle}
        />
        <IconButton
          icon={<Minus />}
          onClick={() => setSelectedTool(Tool.Line)}
          activated={selectedTool === Tool.Line}
        />
      </div>
    </div>
  );
}
