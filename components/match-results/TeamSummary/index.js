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
      } team-summary pt-4 pb-0 pr-4 pl-4 w-screen bg-[#0a0e13] text-white text-sm items-center border-b-gray-300 border-b-1`}
    >
      <DragonComparison dragonEvents={dragonEvents} />
      <GoldComparison
        blueGoldEarned={blueTeam.goldEarned}
        redGoldEarned={redTeam.goldEarned}
      />
      <div className="details flex">
        {matchRoundTeamStats.map((teamStats, i) => (
          <TeamObjectives
            key={teamStats.TeamId}
            teamSide={i === 0 ? "blue" : "red"}
            count={i + 1}
            {...teamStats}
          />
        ))}
      </div>
    </section>
  );
}
