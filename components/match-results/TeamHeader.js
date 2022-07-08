import Image from "next/image";
import React from "react";

export default function TeamHeader({
  tricode,
  teamSide,
  toggleState,
  matchRounds,
  teamId,
}) {
  function Tricode() {
    return (
      <span
        className={`tricode ${
          teamSide === "blue" ? "text-left" : "text-right"
        } font-semibold px-2`}
      >
        {tricode}
      </span>
    );
  }

  function TeamLogo() {
    return (
      <Image
        src={`/teams/${tricode}.png`}
        alt="Team Logo"
        width="36"
        height="36"
      />
    );
  }

  const roundIndex = toggleState - 1;

  const thisTeamWon = matchRounds[roundIndex].winningTeamId === teamId;

  if (teamSide === "blue") {
    return (
      <div className="team flex items-center p-3 relative">
        {thisTeamWon ? (
          <span className="text-green-700 font-bold absolute -left-7">W</span>
        ) : (
          <span className="text-red-700 font-bold absolute -left-7">L</span>
        )}
        <Tricode />
        <TeamLogo />
      </div>
    );
  } else if (teamSide === "red") {
    return (
      <div className="team flex items-center p-3 relative">
        {thisTeamWon ? (
          <span className="text-green-700 font-bold absolute -right-7">W</span>
        ) : (
          <span className="text-red-700 font-bold absolute -right-7">L</span>
        )}
        <TeamLogo />
        <Tricode />
      </div>
    );
  }
}
