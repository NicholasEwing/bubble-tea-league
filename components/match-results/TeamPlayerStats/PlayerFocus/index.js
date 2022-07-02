import Image from "next/image";
import React, { useState } from "react";
import Abilities from "./Abilities";
import ComparisonDetailsSelector from "./ComparisonDetailsSelector";
import HideMatchupButton from "./HideMatchupButton";
import Items from "./Items";
import PlayerComparison from "./PlayerComparison";
import Stats from "./Stats";

export default function PlayerFocus({ player, selectPlayer }) {
  const [activeTab, setActiveTab] = useState("stats");

  const selectTab = (tab) => {
    setActiveTab(tab);
  };

  function renderTabSection(activeTab) {
    switch (activeTab) {
      case "stats":
        return <Stats player={player} />;
      case "items":
        return <Items playerItemEvents={player.playerItemEvents} {...player} />;
      case "abilities":
        return (
          <Abilities
            playerAbilityLevelEvents={player.playerAbilityLevelEvents}
            championName={player.championName}
            champLevel={player.champLevel}
          />
        );
      case "runes":
        return <p className="text-white">runes</p>;
      default:
        return (
          <p className="text-white">
            Section not found. Something broke in the code. Go yell at Nick!
          </p>
        );
    }
  }

  return (
    <section
      className={`StatsMatchup ${
        player ? "block" : "hidden"
      } absolute left-0 top-0 z-50 h-full w-full bg-[#0f1519] text-white`}
    >
      <div className="flex flex-row items-center border-b bg-[#0a0e13] border-b-[#252c32] h-24">
        <HideMatchupButton selectPlayer={selectPlayer} />
        <PlayerComparison {...player} />
      </div>
      <div className="text-left border-b bg-[#0a0e13] border-b-[#252c32] h-16 text-[#8fa3b0]">
        <ComparisonDetailsSelector
          selectTab={selectTab}
          activeTab={activeTab}
        />
      </div>
      {renderTabSection(activeTab)}
    </section>
  );
}
