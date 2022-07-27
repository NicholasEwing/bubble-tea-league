import React from "react";

export default function Score({ teamOneScore = 0, teamTwoScore = 0 }) {
  return (
    <div className="score w-[calc(((100%-312px)/12*2+24px)] absolute lg:w-20 lg:flex-row ml-24 lg:ml-0 text-white lg:static flex flex-col items-center justify-center tracking-widest font-medium">
      <span
        className={`scoreTeam1 ${
          teamOneScore > teamTwoScore
            ? "text-[#c79e57] lg:relative lg:before:block lg:before:absolute lg:before:top-0 lg:before:-left-5 lg:before:text-[#b19955] lg:before:w-6 lg:before:text-sm lg:before:px-2 lg:before:pt-[2px] lg:before:content-['◀']"
            : "text-[#8fa3b0]"
        } mb-1 lg:mb-0 lg:text-white`}
      >
        {teamOneScore}
      </span>
      <span className="hyphen hidden lg:inline lg:text-white">-</span>
      <span
        className={`scoreTeam2 ${
          teamTwoScore > teamOneScore
            ? "text-[#c79e57] lg:relative lg:after:block lg:after:absolute lg:after:top-0 lg:after:-right-5 lg:after:text-[#b19955] lg:after:w-6 lg:after:text-sm lg:after:px-2 lg:after:pt-[2px] lg:after:content-['▶']"
            : "text-[#8fa3b0]"
        } lg:text-white`}
      >
        {teamTwoScore}
      </span>
    </div>
  );
}
