import { Game } from "@/draw/Game";
import { Plus, Minus } from "lucide-react";
import { IconButton } from "./IconButton";

// Desktop Zoom Bar
export function ZoomBar({ game }: { game: Game }) {
  return (
    <div className="bg-[#232329] rounded-lg shadow-md">
      <div className="flex gap-2 bg-transparent rounded-xl">
        <IconButton
          icon={<Plus size={17} />}
          isBorder={false}
          onClick={() => {
            game.zoomInHandler();
          }}
        />
        <IconButton
          icon={<Minus size={17} />}
          isBorder={false}
          onClick={() => game.zoomOutHandler()}
        />
      </div>
    </div>
  );
}
