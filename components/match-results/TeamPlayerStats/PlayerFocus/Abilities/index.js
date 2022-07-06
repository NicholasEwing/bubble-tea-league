import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Abilities({
  playerAbilityLevelEvents,
  playerChampionName,
  playerChampLevel,
  comparedPlayerAbilityLevelEvents,
  comparedPlayerChampionName,
  comparedPlayerChampLevel,
}) {
  const [isLoading, setLoading] = useState(true);
  const [primaryChampInfo, setPrimaryChampInfo] = useState();
  const [secondaryChampInfo, setSecondaryChampInfo] = useState();

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

  const abilityKeybindings = ["Q", "W", "E", "R"];

  const Row = ({ rowNumber, skillSlot }) => (
    <div className="flex">
      <p className="block w-1/5 text-center py-1 border-t border-t-[#252c32] font-medium text-white">
        {rowNumber}
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 1 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        Q
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 2 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        W
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 3 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        E
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 4 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        R
      </p>
    </div>
  );

  const PlayerAbilities = ({ championName, champInfo, isPrimary }) => {
    return (
      <div className="header flex mb-3 justify-around">
        <div className="relative w-12 h-12">
          <div className="w-full h-full after:absolute after:block after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-gradient-to-b after:from-transparent after:to-black">
            <Image
              src={`http://ddragon.leagueoflegends.com/cdn/12.12.1/img/passive/${champInfo.data[championName].passive.image.full}`}
              alt={``}
              height="48"
              width="48"
            />
          </div>
        </div>
        {champInfo.data[championName].spells.map((spell, i) => (
          <div key={spell.id} className="relative w-12 h-12">
            <div className="w-full h-full after:absolute after:block after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-gradient-to-b after:from-transparent after:to-black">
              <Image
                src={`http://ddragon.leagueoflegends.com/cdn/12.12.1/img/spell/${spell.image.full}`}
                alt={``}
                height="48"
                width="48"
              />
            </div>
            <p className="absolute block text-white bottom-0 left-1/2 -translate-x-1/2 text-center w-5 h-5 leading-loose uppercase font-medium ">
              {abilityKeybindings[i]}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const PlayerSkillOrder = ({
    playerAbilityLevelEvents,
    championName,
    isPrimary,
  }) =>
    playerAbilityLevelEvents.map((event, i) => (
      <Row
        key={`${championName}-Row-${i + 1}`}
        rowNumber={i + 1}
        skillSlot={event.skillSlot}
      />
    ));

  return (
    <section className="flex min-h-[600px]">
      <div className="flex-1 xl:flex">
        <div className="flex flex-col p-8 border-b border-b-[#252c32] xl:border-r xl:border-[#252c32] xl:flex-1">
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
        <div className="flex flex-col p-8 border-b border-b-[#252c32] hidden xl:block xl:flex-1">
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
    </section>
  );
}
