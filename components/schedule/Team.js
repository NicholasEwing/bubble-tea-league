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
    <div className="team flex flex-row lg:pr-4 lg:last:pl-4 lg:last:text-left lg:flex-row-reverse lg:last:flex-row lg:w-[45%] text-right justify-start items-center font-medium">
      <div className="flex w-4 h-4 lg:hidden">
        <TeamLogo tricode={tricode} faded={isLoser} />
      </div>
      <div className="hidden my-4 w-20 h-20 lg:flex">
        <TeamLogo tricode={tricode} faded={isLoser} width={80} height={80} />
      </div>
      <div className="team-info pl-1 pr-0">
        <h2
          className={`${
            isLoser ? "text-[#8fa3b0]" : (isTBD || isWinner) && "text-white"
          } ${isWinner && "lg:text-[#c79e57]"}`}
        >
          <span className="name hidden lg:block lg:font-light">{teamName}</span>
          <span className="tricode uppercase block lg:hidden">{tricode}</span>
        </h2>
        <div className="winloss hidden lg:block text-[#8fa3b0] tracking-widest font-medium">
          {wins}W-{losses}L
        </div>
      </div>
    </div>
  );
}
