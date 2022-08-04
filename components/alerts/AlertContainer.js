import React from "react";

export default function AlertContainer({ children, bgColor = "white" }) {
  return (
    <div className={`rounded-md bg-${bgColor} p-2`}>
      <div className="flex">{children}</div>
    </div>
  );
}
