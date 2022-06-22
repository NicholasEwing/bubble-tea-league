import React from "react";

export default function GoldComparison({ blueGoldEarned, redGoldEarned }) {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " K"
      : Math.sign(num) * Math.abs(num);
  }

  return (
    <div className="gold">
      <div className="bar flex">
        <div className="blue-team flex-1 mr-1 border-b-4 border-b-[#1580b6]"></div>
        <div className="red-team flex-1 ml-1 border-b-4 border-b-[#de2f2f]"></div>
      </div>
      <div className="totals flex mt-2 font-medium text-lg">
        <div className="blue-team flex-1">{kFormatter(blueGoldEarned)}</div>
        <div className="title text-center flex-1 text-[#8fa3b0] tracking-widest text-sm">
          GOLD
        </div>
        <div className="red-team flex-1 text-right">
          {kFormatter(redGoldEarned)}
        </div>
      </div>
    </div>
  );
}
