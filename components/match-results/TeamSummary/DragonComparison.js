import React from "react";

export default function DragonComparison({
  blueDragonsKilled,
  redDragonsKilled,
}) {
  return (
    <div className="dragons flex mb-4">
      <span className="blue-team flex-1">{blueDragonsKilled}</span>
      <span className="label text-center flex-1 text-[#8fa3b0] tracking-widest font-semibold text-sm">
        DRAGONS
      </span>
      <span className="red-team flex-1 text-right">{redDragonsKilled}</span>
    </div>
  );
}
