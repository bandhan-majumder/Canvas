import React from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  isBorder = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  activated?: boolean;
  isBorder?: boolean;
}) {
  return (
    <div
      className={`cursor-pointer rounded-lg ${isBorder ? "border" : ""} p-2 hover:bg-[#2E2D39] ${activated ? "bg-[#403E6A] text-white" : "text-white"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
