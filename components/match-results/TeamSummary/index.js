import React from "react";
import DragonComparison from "./DragonComparison";
import GoldComparison from "./GoldComparison";
import TeamObjectives from "./TeamObjectives";

export default function TeamSummary({
  matchRoundTeamStats,
  toggleState,
  count,
  dragonEvents,
}) {
  const blueTeam = matchRoundTeamStats[0];
  const redTeam = matchRoundTeamStats[1];

  return (
    <section
      className={`${
        toggleState === count ? "block" : "hidden"
      } team-summary border-b-1 items-center border-b-gray-300 bg-[#0a0e13] pt-4 pb-0 pr-4 pl-4 text-sm text-white`}
    >
      <DragonComparison dragonEvents={dragonEvents} />
      <GoldComparison
        blueGoldEarned={blueTeam.goldEarned}
        redGoldEarned={redTeam.goldEarned}
      />
      <div className="details flex">
        {matchRoundTeamStats.map((teamStats, i) => (
          <TeamObjectives
            key={teamStats.teamId}
            teamSide={i === 0 ? "blue" : "red"}
            count={count}
            {...teamStats}
          />
        ))}
      </div>
    </section>
  );
}
