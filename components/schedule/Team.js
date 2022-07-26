import React from "react";
import TeamLogo from "../match-results/TeamHeader/TeamLogo";

export default function Team({
  teamName,
  tricode,
  wins,
  losses,
  isWinner,
  isLoser,
}) {
  // const isWinner = false;
  // const isLoser = false;
  const isTBD = teamName === "TBD" || (!isWinner && !isLoser);

  return (
    <div className="team flex flex-row text-right justify-start items-center font-medium">
      <div className="flex w-4 h-4">
        <TeamLogo tricode="PIO" />
      </div>
      <div className="team-info pl-1 pr-0">
        <h2
          className={`${
            isLoser ? "text-[#8fa3b0]" : (isTBD || isWinner) && "text-white"
          }`}
        >
          <span className="name hidden">Panic in Our Oceans</span>
          <span className="tricode block lg:hidden">PIO</span>
        </h2>
        <div className="winloss hidden lg:block text-[#8fa3b0] tracking-widest font-medium">
          2W-9L
        </div>
      </div>
    </div>
  );
}
