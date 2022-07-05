import Image from "next/image";
import React from "react";

export default function PlayerComparison({
  summonerName,
  championName,
  teamPosition,
  champLevel,
}) {
  return (
    <div className="StatsMatchupPlayers flex font-semibold text-[#8fa3b0] bg-[#0a0e13] flex-1 h-full">
      <div className="player primary pl-4 flex flex-row-reverse items-center flex-1">
        <div className="details flex-1 items-center pl-4">
          <div className="name text-white text-lg pb-1">{summonerName}</div>
          <div className="champion inline text-sm uppercase">
            {championName}
          </div>
          <span className="separator px-1">–</span>
          <div className="role inline text-sm uppercase">{teamPosition}</div>
        </div>
        <div className="portrait basis-[60px] h-[60px] relative">
          <div className="wrapper w-full h-full rounded-[30px] overflow-hidden">
            <Image
              className="image"
              src={`https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${championName}.png`}
              alt=""
              layout="fixed"
              width="60"
              height="60"
              style={{ transform: "scale3d(1.2, 1.2, 1.2)" }}
            />
          </div>
          <div className="level absolute -right-1 -bottom-1 w-7 h-7 pt-[3px] font-medium text-sm text-center border border-[#252c32] bg-black text-white rounded-[20px]">
            {champLevel}
          </div>
        </div>
      </div>
      <div className="player secondary hidden">
        <div className="details">
          <div className="name">TL Bwipo</div>
          <div className="champion">Aatrox</div>
          <span className="separator">–</span>
          <div className="role">top</div>
        </div>
        <div className="portrait">
          <div className="wrapper">
            <Image
              className="image"
              src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Aatrox.png"
              alt=""
              layout="fixed"
              width="60"
              height="60"
            />
          </div>
          <div className="level">1</div>
        </div>
      </div>
    </div>
  );
}
