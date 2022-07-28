import Image from "next/image";
import React, { useEffect, useState } from "react";
import MatchSection from "../../Containers/MatchSection";
import Abilities from "./Abilities";
import ComparisonDetailsSelector from "./ComparisonDetailsSelector";
import HideMatchupButton from "./HideMatchupButton";
import Items from "./Items";
import PlayerFocusHeaders from "./PlayerFocusHeaders";
import Runes from "./Runes";
import Stats from "./Stats";

export default function PlayerFocus({
  focusedPlayer,
  focusedPlayerRow,
  selectFocusedPlayerRow,
  mobileFocus,
  toggleMobileFocus,
}) {
  const [activeTab, setActiveTab] = useState("stats");

  const selectTab = (tab) => {
    setActiveTab(tab);
  };

  const [player, comparedPlayer] = focusedPlayerRow;

  function renderTabSection(activeTab) {
    switch (activeTab) {
      case "stats":
        return (
          <Stats
            player={player}
            comparedPlayer={comparedPlayer}
            focusedPlayer={focusedPlayer}
          />
        );
      case "items":
        return (
          <Items
            player={player}
            playerItemEvents={player.playerItemEvents}
            comparedPlayer={comparedPlayer}
            comparedPlayerItemEvents={comparedPlayer.playerItemEvents}
            focusedPlayer={focusedPlayer}
            focusedPlayerItemEvents={focusedPlayer.playerItemEvents}
          />
        );
      case "abilities":
        return (
          <Abilities
            playerAbilityLevelEvents={player.playerAbilityLevelEvents}
            playerChampionName={player.championName}
            playerChampLevel={player.champLevel}
            comparedPlayerAbilityLevelEvents={
              comparedPlayer.playerAbilityLevelEvents
            }
            comparedPlayerChampionName={comparedPlayer.championName}
            comparedPlayerChampLevel={comparedPlayer.champLevel}
            focusedPlayerAbilityLevelEvents={
              focusedPlayer.playerAbilityLevelEvents
            }
            focusedPlayerChampionName={focusedPlayer.championName}
            focusedPlayerChampLevel={focusedPlayer.champLevel}
          />
        );
      case "runes":
        return (
          <Runes
            playerPrimaryRunePath={player.primaryRunePath}
            playerPrimaryRunePerks={player.primaryRunePerks}
            playerSecondaryRunePath={player.secondaryRunePath}
            playerSecondaryRunePerks={player.secondaryRunePerks}
            comparedPlayerPrimaryRunePath={comparedPlayer.primaryRunePath}
            comparedPlayerPrimaryRunePerks={comparedPlayer.primaryRunePerks}
            comparedPlayerSecondaryRunePath={comparedPlayer.secondaryRunePath}
            comparedPlayerSecondaryRunePerks={comparedPlayer.secondaryRunePerks}
            focusedPlayerPrimaryRunePath={focusedPlayer.primaryRunePath}
            focusedPlayerPrimaryRunePerks={focusedPlayer.primaryRunePerks}
            focusedPlayerSecondaryRunePath={focusedPlayer.secondaryRunePath}
            focusedPlayerSecondaryRunePerks={focusedPlayer.secondaryRunePerks}
          />
        );
      default:
        return (
          <p className="text-white">
            Section not found. Something broke in the code. Go yell at Nick!
          </p>
        );
    }
  }

  return (
    <div
      className={`${
        mobileFocus ? "absolute" : "hidden"
      }  sm:static sm:block flex-1 w-full sm:w-auto sm:h-auto left-0 top-0 z-50 h-[calc(100%-64px)]`}
    >
      <MatchSection left>
        <ul className="menu list-none	pt-1 px-2">
          <li
            className="tab title stats selected tracking-widest p-4 font-medium text-sm border-b-4 border-b-teal-accent h-full grid place-items-center"
            role="button"
          >
            STATS
          </li>
        </ul>
      </MatchSection>
      <section
        className={`StatsMatchup block bg-[#0f1519] text-white h-full sm:h-auto`}
      >
        <div className="flex flex-row items-center border-b bg-[#0a0e13] border-b-[#252c32] h-24">
          <HideMatchupButton toggleMobileFocus={toggleMobileFocus} />
          <PlayerFocusHeaders
            player={player}
            comparedPlayer={comparedPlayer}
            focusedPlayer={focusedPlayer}
          />
        </div>
        <div className="text-left border-b bg-[#0a0e13] border-b-[#252c32] h-16 text-[#8fa3b0]">
          <ComparisonDetailsSelector
            selectTab={selectTab}
            activeTab={activeTab}
          />
        </div>
        {renderTabSection(activeTab)}
      </section>
    </div>
  );
}
