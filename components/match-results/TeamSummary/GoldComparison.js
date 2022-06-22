import React from "react";

export default function GoldComparison() {
  return (
    <div className="gold">
      <div className="bar flex">
        <div className="blue-team flex-1 mr-1 border-b-4 border-b-[#1580b6]"></div>
        <div className="red-team flex-1 ml-1 border-b-4 border-b-[#de2f2f]"></div>
      </div>
      <div className="totals flex mt-2 font-semibold text-lg">
        <div className="blue-team flex-1">2.5 K</div>
        <div className="title text-center flex-1 text-[#8fa3b0] tracking-widest font-semibold text-sm">
          GOLD
        </div>
        <div className="red-team flex-1 text-right">2.5 K</div>
      </div>
    </div>
  );
}
