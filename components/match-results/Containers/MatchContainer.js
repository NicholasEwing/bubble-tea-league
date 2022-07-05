import React from "react";

export default function MatchContainer({ children, isMobile }) {
  return (
    <div
      className={`border-r border-r-[#252c32] ${
        isMobile
          ? "flex justify-center"
          : "min-w-[400px] max-w-[480px] w-[calc(((100% - 442px) / 12) * 4 + 136px)]"
      }`}
    >
      {children}
    </div>
  );
}
