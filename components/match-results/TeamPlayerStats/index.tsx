import { MatchRoundPlayerStats, Player } from "@prisma/client";
import { PlayerRow } from "../../../types";
import PlayerStats from "./PlayerStats";

interface TeamPlayerStatsProps {
  matchRoundPlayerStats: MatchRoundPlayerStats[];
  toggleState: number;
  count: number;
  selectFocusedPlayerRow: Function;
  focusedPlayerRow: PlayerRow;
  focusedPlayer: MatchRoundPlayerStats;
  toggleMobileFocus: Function;
}

export default function TeamPlayerStats({
  matchRoundPlayerStats,
  toggleState,
  count,
  selectFocusedPlayerRow,
  focusedPlayerRow,
  focusedPlayer,
  toggleMobileFocus,
}: TeamPlayerStatsProps) {
  const bluePlayers = matchRoundPlayerStats.filter(
    (player) => player.teamSide === "blue"
  );
  const redPlayers = matchRoundPlayerStats.filter(
    (player) => player.teamSide === "red"
  );

  return (
    <section
      className={`${
        toggleState === count ? "flex" : "hidden"
      } player-stats relative bg-[#0a0e13] text-white`}
    >
      <div className="blue-team flex-1 border-r border-r-[#252c32]">
        {bluePlayers.map((p: MatchRoundPlayerStats, i: number) => (
          <PlayerStats
            key={`${p.summonerName}-${toggleState}-blue`}
            player={p}
            selectFocusedPlayerRow={selectFocusedPlayerRow}
            opposingPlayer={redPlayers[i]}
            toggleMobileFocus={toggleMobileFocus}
            isRed={false}
            isBlue
            isSelectedByRow={!!focusedPlayerRow.find((r) => r.id === p.id)}
            isSelectedIndividually={focusedPlayer.id === p.id}
          />
        ))}
      </div>
      <div className="red-team flex-1 items-end">
        {redPlayers.map((p: MatchRoundPlayerStats, i: number) => (
          <PlayerStats
            key={`${p.summonerName}-${toggleState}-red`}
            player={p}
            selectFocusedPlayerRow={selectFocusedPlayerRow}
            opposingPlayer={bluePlayers[i]}
            toggleMobileFocus={toggleMobileFocus}
            isRed
            isBlue={false}
            isSelectedByRow={!!focusedPlayerRow.find((r) => r.id === p.id)}
            isSelectedIndividually={focusedPlayer.id === p.id}
          />
        ))}
      </div>
    </section>
  );
}
