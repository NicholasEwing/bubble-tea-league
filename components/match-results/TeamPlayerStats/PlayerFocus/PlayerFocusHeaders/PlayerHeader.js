import Image from "next/image";
import React from "react";

export default function PlayerHeader({ player, isPrimary }) {
  return (
    <div
      className={`player primary px-4 flex flex-row-reverse items-center flex-1 ${
        isPrimary
          ? "xl:flex-row xl:text-right xl:border-r xl:border-r-[#252c32]"
          : "hidden xl:flex"
      }`}
    >
      <div className="details flex-1 items-center px-4">
        <div className="name text-white text-lg pb-1">
          {player.summonerName}
        </div>
        <div className="champion inline text-sm uppercase">
          {player.championName}
        </div>
        <span className="separator px-1">–</span>
        <div className="role inline text-sm uppercase">
          {player.teamPosition}
        </div>
      </div>
      <div className="portrait basis-[60px] h-[60px] relative">
        <div className="wrapper w-full h-full rounded-[30px] overflow-hidden">
          <Image
            className="image"
            src={`https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${player.championName}.png`}
            alt=""
            layout="fixed"
            width="60"
            height="60"
            style={{ transform: "scale3d(1.2, 1.2, 1.2)" }}
          />
        </div>
        <div
          className={`level absolute ${
            isPrimary ? "-left-1 -bottom-1" : "-right-1 -bottom-1"
          } w-7 h-7 pt-[3px] font-medium text-sm text-center border border-[#252c32] bg-black text-white rounded-[20px]`}
        >
          {player.champLevel}
        </div>
      </div>
    </div>
  );
}
