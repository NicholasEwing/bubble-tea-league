import Image from "next/image";
import Link from "next/link";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function Team({
  isUpperBracket,
  matchId,
  team,
  matchWinnerTeamId,
  matchLoserTeamId,
  matchRounds,
}) {
  const {
    id,
    tricode = "TBD",
    teamName = "TBD",
    playoffsWins,
    playoffsLosses,
  } = team || {};

  const isWinner = matchWinnerTeamId === id || false;
  const isLoser = matchLoserTeamId === id || false;

  const isTBD = teamName === "TBD" && !isWinner && !isLoser;

  const noScore = !matchRounds.filter((mr) => mr.winningTeamId).length > 0;
  const teamWins = matchRounds.filter((mr) => mr.winningTeamId === id).length;

  const score = noScore ? "-" : teamWins;

  return (
    <Link href={`${tricode === "TBD" ? "#" : `/teams/${id}`}`}>
      <a
        className={`team tbd flex flex-row text-white border-b border-b-[#252c32] items-center bg-black box-content h-14 relative select-none ${
          isLoser && "before:bg-[#252c32]"
        } ${isWinner && "before:bg-[#c79e57]"} ${
          !isWinner && !isLoser && "before:bg-[#8fa3b0]"
        }
        before:block before:flex-shrink-0 before:h-full before:w-1`}
      >
        <div
          className={`logo ${
            !isTBD && isLoser ? "opacity-20" : "opacity-100"
          } flex-shrink-0 h-auto mx-5 w-9`}
        >
          <TeamLogo tricode={tricode} faded={isLoser} tbd={isTBD} />
        </div>
        <div
          className={`name hidden sm:block font-light w-full ${
            isLoser ? "text-[#8fa3b0]" : "text-white"
          }`}
        >
          {teamName}
        </div>
        <div
          className={`tricode w-full font-light sm:hidden ${
            isLoser ? "text-[#8fa3b0]" : "text-white"
          }`}
        >
          {tricode}
        </div>
        <div
          className={`score text-white ${isLoser && "text-[#8fa3b0]"} ${
            isWinner && "text-[#c79e57]"
          } ${
            !isWinner && !isLoser && "text-white"
          } font-medium mx-5 my-7 relative`}
        >
          {score}
        </div>
      </a>
    </Link>
  );
}
