import Image from "next/image";
import React from "react";

export default function PlayerHeader({ player, isPrimary }) {
  return (
    <div
      className={`player primary flex flex-1 flex-row-reverse items-center px-4 ${
        isPrimary
          ? "xl:flex-row xl:border-r xl:border-r-[#252c32] xl:text-right"
          : "hidden xl:flex"
      }`}
    >
      <div className="details flex-1 items-center px-4">
        <div className="name pb-1 text-lg text-white">
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
      <div className="portrait relative h-[60px] basis-[60px]">
        <div className="wrapper h-full w-full overflow-hidden rounded-[30px]">
          <Image
            className="image"
            src={`https://ddragon.leagueoflegends.com/cdn/${process.env.patchNumber}/img/champion/${player.championName}.png`}
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
          } h-7 w-7 rounded-[20px] border border-[#252c32] bg-black pt-[3px] text-center text-sm font-medium text-white`}
        >
          {player.champLevel}
        </div>
      </div>
    </div>
  );
}
