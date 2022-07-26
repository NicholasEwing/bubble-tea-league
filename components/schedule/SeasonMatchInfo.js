import React from "react";

export default function SeasonMatchInfo({
  seasonNumber = "1",
  format = "Bo1",
}) {
  return (
    <div className="league w-[calc(((100%-195px)/12)*4+45px)] h-12 basis-28 grow-0 shrink-0 tracking-widest font-medium text-right text-[#8fa3b0]">
      <div className="name uppercase text-xs">Season {seasonNumber}</div>
      <div className="strategy uppercase text-xs">{format}</div>
    </div>
  );
}
