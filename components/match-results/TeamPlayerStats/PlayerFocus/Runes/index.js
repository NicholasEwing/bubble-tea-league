import Image from "next/image";
import React, { useEffect, useState } from "react";
import RuneList from "./RuneList";

export default function Runes({
  playerPrimaryRunePath,
  playerPrimaryRunePerks,
  playerSecondaryRunePath,
  playerSecondaryRunePerks,
  comparedPlayerPrimaryRunePath,
  comparedPlayerPrimaryRunePerks,
  comparedPlayerSecondaryRunePath,
  comparedPlayerSecondaryRunePerks,
}) {
  // reach out to ddragon for rune information
  const [isLoading, setLoading] = useState(true);
  const [runeInfo, setRuneInfo] = useState({});

  const [playerRunes, setPlayerRunes] = useState({});
  const [comparedPlayerRunes, setComparedPlayerRunes] = useState({});

  // get compared player info

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
      const primaryRuneObj = runeInfo.find(
        (r) => r.id === playerPrimaryRunePath
      );
      const primaryRuneName = primaryRuneObj.name;
      const primaryRuneImage = primaryRuneObj.icon;

      const primaryPerks = JSON.parse(playerPrimaryRunePerks);

      const primaryRunes = primaryPerks.flatMap((rune) => {
        return primaryRuneObj.slots.flatMap((slot) =>
          slot.runes.filter((r) => r.id === rune.perk)
        );
      });

      const secondaryRuneObj = runeInfo.find(
        (r) => r.id === playerSecondaryRunePath
      );
      const secondaryRuneName = secondaryRuneObj.name;
      const secondaryRuneImage = secondaryRuneObj.icon;

      const secondaryPerks = JSON.parse(playerSecondaryRunePerks);

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
      setPlayerRunes(runeStateObj);
    }
  }, [
    isLoading,
    playerPrimaryRunePath,
    playerPrimaryRunePerks,
    playerSecondaryRunePath,
    playerSecondaryRunePerks,
    runeInfo,
  ]);

  useEffect(() => {
    if (!isLoading) {
      const primaryRuneObj = runeInfo.find(
        (r) => r.id === comparedPlayerPrimaryRunePath
      );
      const primaryRuneName = primaryRuneObj.name;
      const primaryRuneImage = primaryRuneObj.icon;

      const primaryPerks = JSON.parse(comparedPlayerPrimaryRunePerks);

      const primaryRunes = primaryPerks.flatMap((rune) => {
        return primaryRuneObj.slots.flatMap((slot) =>
          slot.runes.filter((r) => r.id === rune.perk)
        );
      });

      const secondaryRuneObj = runeInfo.find(
        (r) => r.id === comparedPlayerSecondaryRunePath
      );
      const secondaryRuneName = secondaryRuneObj.name;
      const secondaryRuneImage = secondaryRuneObj.icon;

      const secondaryPerks = JSON.parse(comparedPlayerSecondaryRunePerks);

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
      setComparedPlayerRunes(runeStateObj);
    }
  }, [
    isLoading,
    comparedPlayerPrimaryRunePath,
    comparedPlayerPrimaryRunePerks,
    comparedPlayerSecondaryRunePath,
    comparedPlayerSecondaryRunePerks,
    runeInfo,
  ]);

  return (
    <div className="flex text-white min-h-[800px] bg-[#0f1519]">
      <div className="flex-1 xl:flex">
        <RuneList runes={playerRunes} isPrimary />
        <RuneList runes={comparedPlayerRunes} />
      </div>
    </div>
  );
}
