import Image from "next/image";
import React, { useEffect, useState } from "react";
import PlayerAbilities from "./PlayerAbilities";
import PlayerSkillOrder from "./PlayerSkillOrder";

export default function Abilities({
  playerAbilityLevelEvents,
  playerChampionName,
  playerChampLevel,
  comparedPlayerAbilityLevelEvents,
  comparedPlayerChampionName,
  comparedPlayerChampLevel,
  focusedPlayerAbilityLevelEvents,
  focusedPlayerChampionName,
  focusedPlayerChampLevel,
}) {
  const [isLoading, setLoading] = useState(true);
  const [primaryChampInfo, setPrimaryChampInfo] = useState();
  const [secondaryChampInfo, setSecondaryChampInfo] = useState();
  const [focusedChampInfo, setFocusedChampInfo] = useState();

  useEffect(() => {
    async function fetchChampInfo() {
      const res = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${playerChampionName}.json`
      );

      const champInfo = await res.json();

      setPrimaryChampInfo(champInfo);
      setLoading(false);
    }
    fetchChampInfo();
  }, [playerChampionName]);

  useEffect(() => {
    async function fetchChampInfo() {
      const res = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${comparedPlayerChampionName}.json`
      );

      const champInfo = await res.json();

      setSecondaryChampInfo(champInfo);
      setLoading(false);
    }
    fetchChampInfo();
  }, [comparedPlayerChampionName]);

  useEffect(() => {
    async function fetchChampInfo() {
      const res = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${focusedPlayerChampionName}.json`
      );

      const champInfo = await res.json();

      setFocusedChampInfo(champInfo);
      setLoading(false);
    }
    fetchChampInfo();
  }, [focusedPlayerChampionName]);

  return (
    <section className="flex min-h-[600px]">
      <div className="flex-1 hidden xl:flex">
        <div className="flex flex-col p-8 border-b border-b-[#252c32] border-r border-[#252c32] flex-1">
          {!isLoading && primaryChampInfo && (
            <>
              <PlayerAbilities
                championName={playerChampionName}
                champInfo={primaryChampInfo}
                isPrimary
              />
              <PlayerSkillOrder
                championName={playerChampionName}
                playerAbilityLevelEvents={playerAbilityLevelEvents}
                isPrimary
              />
            </>
          )}
        </div>
        <div className="flex-col p-8 border-b border-b-[#252c32] flex-1">
          {!isLoading && secondaryChampInfo && (
            <>
              <PlayerAbilities
                championName={comparedPlayerChampionName}
                champInfo={secondaryChampInfo}
              />
              <PlayerSkillOrder
                championName={comparedPlayerChampionName}
                playerAbilityLevelEvents={comparedPlayerAbilityLevelEvents}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex-1 xl:hidden">
        <div className="flex flex-col p-8 border-b border-b-[#252c32]">
          {!isLoading && focusedChampInfo && (
            <>
              <PlayerAbilities
                championName={focusedPlayerChampionName}
                champInfo={focusedChampInfo}
                isPrimary
              />
              <PlayerSkillOrder
                championName={focusedPlayerChampionName}
                playerAbilityLevelEvents={focusedPlayerAbilityLevelEvents}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
