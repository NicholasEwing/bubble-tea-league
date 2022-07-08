import React from "react";

export default function StageSelector() {
  return (
    <div className="stage-selector flex border-b border-b-[#252c32] text-sm font-medium overflow-x-auto items-center h-14">
      <div className="title mx-5 text-[#8fa3b0] uppercase">STAGE:</div>
      <div className="options flex h-full">
        <button className="button uppercase selected text-[#00c8c8] items-center flex flex-shrink-0 mr-6 h-full cursor-pointer">
          Regular Season
        </button>
        <button className="button uppercase text-white items-center flex flex-shrink-0 pr-6 mr-6 h-full cursor-pointer">
          Playoffs
        </button>
      </div>
    </div>
  );
}
