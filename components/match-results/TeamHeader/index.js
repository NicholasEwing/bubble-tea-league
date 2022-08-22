import Image from "next/image";
import Link from "next/link";
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
      <Link href={`/teams/${teamId}`}>
        <a className="team relative flex items-center p-3">
          {thisTeamWon ? (
            <span className="absolute -left-7 font-bold text-green-700">W</span>
          ) : (
            <span className="absolute -left-7 font-bold text-red-700">L</span>
          )}
          <Tricode tricode={tricode} teamSide={teamSide} />
          <TeamLogo tricode={tricode} />
        </a>
      </Link>
    );
  } else if (teamSide === "red") {
    return (
      <Link href={`/teams/${teamId}`}>
        <a className="team relative flex items-center p-3">
          {thisTeamWon ? (
            <span className="absolute -right-7 font-bold text-green-700">
              W
            </span>
          ) : (
            <span className="absolute -right-7 font-bold text-red-700">L</span>
          )}
          <TeamLogo tricode={tricode} />
          <Tricode tricode={tricode} teamSide={teamSide} />
        </a>
      </Link>
    );
  }
}
