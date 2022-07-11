import Image from "next/image";
import React from "react";
import TeamLogo from "./TeamLogo";
import Tricode from "./Tricode";

export default function TeamHeader({
  tricode,
  teamSide,
  toggleState,
  matchRounds,
  teamId,
}) {
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
        <Tricode tricode={tricode} teamSide={teamSide} />
        <TeamLogo tricode={tricode} />
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
        <TeamLogo tricode={tricode} />
        <Tricode tricode={tricode} teamSide={teamSide} />
      </div>
    );
  }
}
