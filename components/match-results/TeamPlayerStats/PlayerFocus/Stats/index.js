import React from "react";
import { kFormatter } from "../../../../../lib/utils";
import PlayerAttributes from "./PlayerAttributes";
import PlayerPeformance from "./PlayerPeformance";

export default function Stats({ player, comparedPlayer, focusedPlayer }) {
  return (
    <div className="stats">
      <div className="StatsMatchupPerformance bg-[#0f1519] hidden xl:flex">
        <PlayerPeformance {...player} isPrimary />
        <PlayerPeformance {...comparedPlayer} />
      </div>
      <div className="StatsMatchupPerformance bg-[#0f1519] flex xl:hidden">
        <PlayerPeformance {...focusedPlayer} isPrimary />
      </div>
      <div className="StatsMatchupAttributes border-t border-t-[#252c32] bg-[#0f1519] hidden xl:flex">
        <PlayerAttributes {...player} isPrimary />
        <PlayerAttributes {...comparedPlayer} />
      </div>
      <div className="StatsMatchupAttributes border-t border-t-[#252c32] bg-[#0f1519] flex xl:hidden">
        <PlayerAttributes {...focusedPlayer} isPrimary />
      </div>
    </div>
  );
}
