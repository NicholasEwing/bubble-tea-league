import React from "react";
import TeamLogo from "../match-results/TeamHeader/TeamLogo";

export default function Team({
  teamName = "TBD",
  tricode = "TBD",
  wins,
  losses,
  isWinner,
  isLoser,
}) {
  const isTBD = teamName === "TBD" || (!isWinner && !isLoser);

  return (
    <div className="team flex flex-row items-center justify-start text-right font-medium lg:w-[45%] lg:flex-row-reverse lg:pr-4 lg:last:flex-row lg:last:pl-4 lg:last:text-left">
      <div className="flex h-4 w-4 lg:hidden">
        <TeamLogo tricode={tricode} faded={isLoser} />
      </div>
      <div className="my-4 hidden h-20 w-24 lg:flex">
        <TeamLogo tricode={tricode} faded={isLoser} width="80" height="80" />
      </div>
      <div className="team-info pl-1 pr-0">
        <h2
          className={`${
            isLoser ? "text-[#8fa3b0]" : (isTBD || isWinner) && "text-white"
          } ${isWinner && "lg:text-[#c79e57]"}`}
        >
          <span className="name hidden lg:block lg:font-light">{teamName}</span>
          <span className="tricode block uppercase lg:hidden">{tricode}</span>
        </h2>
        <div className="winloss hidden font-medium tracking-widest text-[#8fa3b0] lg:block">
          {wins}W-{losses}L
        </div>
      </div>
    </div>
  );
}
