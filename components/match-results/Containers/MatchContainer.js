import React from "react";

export default function MatchContainer({ children }) {
  return (
    <div
      className={`border-r border-r-[#252c32] flex flex-col justify-center sm:h-full sm:min-w-[400px] sm:max-w-[480px] sm:w-[calc(((100% - 442px) / 12) * 4 + 136px)]`}
    >
      {children}
    </div>
  );
}
