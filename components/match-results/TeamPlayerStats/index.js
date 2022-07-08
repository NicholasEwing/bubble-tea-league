import Image from "next/image";
import React from "react";
import PlayerStats from "./PlayerStats";

export default function TeamPlayerStats({
  matchRoundPlayerStats,
  toggleState,
  count,
  selectFocusedPlayerRow,
  focusedPlayerRow,
  focusedPlayer,
  toggleMobileFocus,
}) {
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
        {bluePlayers.map((p, i) => (
          <PlayerStats
            key={`${p.summonerName}-${toggleState}-blue`}
            player={p}
            selectFocusedPlayerRow={selectFocusedPlayerRow}
            opposingPlayer={redPlayers[i]}
            toggleMobileFocus={toggleMobileFocus}
            isBlue
            isSelectedByRow={focusedPlayerRow.find((r) => r.id === p.id)}
            isSelectedIndividually={focusedPlayer.id === p.id}
          />
        ))}
      </div>
      <div className="red-team flex-1 items-end">
        {redPlayers.map((p, i) => (
          <PlayerStats
            key={`${p.summonerName}-${toggleState}-red`}
            player={p}
            selectFocusedPlayerRow={selectFocusedPlayerRow}
            opposingPlayer={bluePlayers[i]}
            toggleMobileFocus={toggleMobileFocus}
            isRed
            isSelectedByRow={focusedPlayerRow.find((r) => r.id === p.id)}
            isSelectedIndividually={focusedPlayer.id === p.id}
          />
        ))}
      </div>
    </section>
  );
}
