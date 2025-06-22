import React from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  isBorder = true,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  activated?: boolean;
  isBorder?: boolean;
}) {
  return (
    <div
      className={`cursor-pointer rounded-full ${isBorder ? "border" : ""} p-2 transform hover:scale-125 ${activated ? "text-red-400" : "text-white"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
