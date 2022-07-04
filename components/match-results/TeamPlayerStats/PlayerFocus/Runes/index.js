import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Runes({
  primaryRunePath,
  primaryRunePerks,
  secondaryRunePath,
  secondaryRunePerks,
}) {
  // reach out to ddragon for rune information
  const [isLoading, setLoading] = useState(true);
  const [runeInfo, setRuneInfo] = useState({});
  const [runeState, setRuneState] = useState({});

  useEffect(() => {
    fetch(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/runesReforged.json`
    )
      .then((r) => r.json())
      .then((info) => {
        setRuneInfo(info);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const primaryRuneObj = runeInfo.find((r) => r.id === primaryRunePath);
      const primaryRuneName = primaryRuneObj.name;
      const primaryRuneImage = primaryRuneObj.icon;

      const primaryPerks = JSON.parse(primaryRunePerks);

      const primaryRunes = primaryPerks.flatMap((rune) => {
        return primaryRuneObj.slots.flatMap((slot) =>
          slot.runes.filter((r) => r.id === rune.perk)
        );
      });

      const secondaryRuneObj = runeInfo.find((r) => r.id === secondaryRunePath);
      const secondaryRuneName = secondaryRuneObj.name;
      const secondaryRuneImage = secondaryRuneObj.icon;

      const secondaryPerks = JSON.parse(secondaryRunePerks);

      const secondaryRunes = secondaryPerks.flatMap((rune) => {
        return secondaryRuneObj.slots.flatMap((slot) =>
          slot.runes.filter((r) => r.id === rune.perk)
        );
      });

      const runeStateObj = {
        primaryRuneName,
        primaryRuneImage,
        primaryRunes,
        secondaryRuneName,
        secondaryRuneImage,
        secondaryRunes,
      };
      setRuneState(runeStateObj);
    }
  }, [
    isLoading,
    primaryRunePath,
    primaryRunePerks,
    secondaryRunePath,
    secondaryRunePerks,
    runeInfo,
  ]);

  // parse perks info since it comes as a string
  const secondaryPerks = JSON.parse(secondaryRunePerks);

  return (
    <div className="flex text-white min-h-[800px] bg-[#0f1519]">
      <div className="flex-1">
        <div className="rune-list mx-8 my-6">
          <div className="rune-category flex items-center border-b border-b-[#252c32] pb-3 mb-6">
            {Object.keys(runeState).length && (
              <>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${runeState.primaryRuneImage}`}
                  alt={`${runeState.primaryRuneName} rune image`}
                  height="24"
                  width="24"
                />
                <p className="block text-md mx-4 font-medium">
                  {runeState.primaryRuneName}
                </p>
              </>
            )}
          </div>
          {runeState.primaryRunes &&
            runeState.primaryRunes.map((rune, i) => (
              <div key={rune.id} className="flex items-center mb-6">
                <div
                  className={`${
                    i === 0 ? "min-w-[75px] mx-2" : "min-w-[45px] mx-6"
                  }`}
                >
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                    alt=""
                    height={`${i === 0 ? "75" : "45"}`}
                    width={`${i === 0 ? "75" : "45"}`}
                  />
                </div>
                <div>
                  <p className="block text-md font-medium">{rune.name}</p>
                  <p className="max-w-[90%] text-sm font-light">
                    {rune.shortDesc.replaceAll(/<(.*?)>/g, " ")}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="rune-list mx-8 my-6">
          <div className="rune-category flex items-center border-b border-b-[#252c32] pb-3 mb-6">
            {Object.keys(runeState).length && (
              <>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${runeState.secondaryRuneImage}`}
                  alt={`${runeState.secondaryRuneName} rune image`}
                  height="24"
                  width="24"
                />
                <p className="block text-md mx-4 font-medium">
                  {runeState.secondaryRuneName}
                </p>
              </>
            )}
          </div>
          {runeState.secondaryRunes &&
            runeState.secondaryRunes.map((rune, i) => (
              <div key={rune.id} className="flex items-center mb-6">
                <div
                  className={`${
                    i === 0 ? "min-w-[75px] mx-2" : "min-w-[45px] mx-6"
                  }`}
                >
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                    alt=""
                    height={`${i === 0 ? "75" : "45"}`}
                    width={`${i === 0 ? "75" : "45"}`}
                  />
                </div>
                <div>
                  <p className="block text-md font-medium">{rune.name}</p>
                  <p className="max-w-[90%] text-sm font-light">
                    {rune.shortDesc.replaceAll(/<(.*?)>/g, "")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
