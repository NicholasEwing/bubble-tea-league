import Image from "next/image";
import React from "react";

const abilityKeybindings = ["Q", "W", "E", "R"];

export default function PlayerAbilities({
  championName,
  champInfo,
  isPrimary,
}) {
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
}
