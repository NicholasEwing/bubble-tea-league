import React from "react";

export default function Match({ children }) {
  return (
    <div className="my-6 w-full relative">
      <div className="teams w-full before:border-left before:border-left-[#8fa3b0] before:absolute before:block after:bg-[#8fa3b0] after:block after:h-1 after:absolute">
        {children}
      </div>
    </div>
  );
}
