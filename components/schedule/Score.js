import React from "react";

export default function Score({ teamOneScore = 0, teamTwoScore = 0 }) {
  // TODO change score color based on match winner
  return (
    <div className="score w-[calc(((100%-312px)/12*2+24px)] ml-24 text-white absolute flex flex-col items-center justify-center tracking-widest font-medium">
      <span
        className={`scoreTeam1 ${
          teamOneScore > teamTwoScore ? "text-[#c79e57]" : "text-[#8fa3b0]"
        } mb-1`}
      >
        {teamOneScore}
      </span>
      <span className="hyphen hidden lg:inline">-</span>
      <span
        className={`scoreTeam2 ${
          teamTwoScore > teamOneScore ? "text-[#c79e57]" : "text-[#8fa3b0]"
        }`}
      >
        {teamTwoScore}
      </span>
    </div>
  );
}
