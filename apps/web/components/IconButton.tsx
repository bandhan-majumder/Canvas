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
      className={`cursor-pointer rounded-lg ${isBorder ? "border" : ""} p-2 transform hover:scale-125 ${activated ? "bg-[#403E6A] text-[#E0DFFF]" : "text-white"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
