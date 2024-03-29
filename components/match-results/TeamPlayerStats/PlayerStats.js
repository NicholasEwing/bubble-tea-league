import Image from "next/image";
import React from "react";
import { kFormatter } from "../../../lib/utils";

export default function PlayerStats({
  player,
  selectFocusedPlayerRow,
  opposingPlayer,
  toggleMobileFocus,
  isBlue,
  isRed,
  isSelectedByRow,
  isSelectedIndividually,
}) {
  const {
    summonerName,
    championName,
    champLevel,
    kills,
    deaths,
    assists,
    totalMinionsKilled,
    goldEarned,
  } = player;

  return (
    <div
      onClick={(e) => {
        if (isRed) {
          selectFocusedPlayerRow(player, [opposingPlayer, player]);
        } else {
          selectFocusedPlayerRow(player, [player, opposingPlayer]);
        }
        toggleMobileFocus();
      }}
      role="button"
      className={`${
        isSelectedByRow ? "xl:pointer-events-none xl:bg-black" : ""
      } ${
        isSelectedIndividually ? "pointer-events-none bg-black" : ""
      } player top flex h-32 flex-wrap border-b border-b-[#252c32] p-4 pr-0 text-sm font-thin`}
    >
      <div className="name basis-full pb-1 font-bold">{summonerName}</div>
      <div
        className={`portrait before:z-1 relative h-16 w-16 basis-16 before:absolute before:-left-[3px] before:-top-[3px] before:-right-[3px] before:-bottom-[3px] before:block before:rounded-[33px] before:border-[3px] before:border-[#0a0e13] ${
          isSelectedByRow
            ? "xl:before:border-teal-accent xl:before:shadow-inner"
            : ""
        } ${
          isSelectedIndividually
            ? "sm:before:border-teal-accent sm:before:shadow-inner"
            : ""
        }`}
      >
        <div className="wrapper z-1 relative h-full w-full overflow-hidden rounded-[30px] bg-[#333] text-center">
          <Image
            className="image m-0 inline-block h-full w-full"
            src={`https://ddragon.leagueoflegends.com/cdn/${process.env.patchNumber}/img/champion/${championName}.png`}
            alt=""
            layout="fill"
            priority
            style={{ transform: "scale3d(1.1,1.1,1.1)" }}
          />
        </div>
        <div className="level z-2 absolute -left-[2px] -bottom-[2px] h-6 w-6 overflow-hidden rounded-3xl border border-t-2 border-[#252c32] bg-black text-center font-thin">
          {champLevel}
        </div>
      </div>
      <div className="details flex-1 pl-1">
        <div className="stat kda">
          <svg
            className="icon float-left clear-left mx-1 mt-[2px] mb-0 inline-block align-bottom leading-5"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            xmlns="https://www.w3.org/2000/svg"
          >
            <g
              className={`shape ${
                isSelectedByRow
                  ? "fill-[#555d64] xl:fill-teal-accent"
                  : "fill-[#555d64]"
              } ${
                isSelectedIndividually
                  ? "sm:fill-teal-accent"
                  : "fill-[#555d64]"
              }`}
              fillRule="evenodd"
            >
              <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
            </g>
          </svg>
          <span className="kills ">{kills}</span>&nbsp;/&nbsp;
          <span className="deaths">{deaths}</span>&nbsp;/&nbsp;
          <span className="assists">{assists}</span>
        </div>
        <div className="stat cs">
          <svg
            className="icon float-left clear-left mx-1 mt-[2px] mb-0 inline-block align-bottom leading-5"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              className={`shape ${
                isSelectedByRow
                  ? "fill-[#555d64] xl:fill-teal-accent"
                  : "fill-[#555d64]"
              } ${
                isSelectedIndividually
                  ? "sm:fill-teal-accent"
                  : "fill-[#555d64]"
              }`}
              d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
            ></path>
          </svg>
          {totalMinionsKilled}
        </div>
        <div className="stat gold">
          <svg
            className="icon float-left clear-left mx-1 mt-[2px] mb-0 inline-block align-bottom leading-5"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            xmlns="https://www.w3.org/2000/svg"
          >
            <g
              className={`shape ${
                isSelectedByRow
                  ? "fill-[#555d64] xl:fill-teal-accent"
                  : "fill-[#555d64]"
              } ${
                isSelectedIndividually
                  ? "sm:fill-teal-accent"
                  : "fill-[#555d64]"
              }`}
              fillRule="evenodd"
            >
              <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
              <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
            </g>
          </svg>
          {kFormatter(goldEarned)}
        </div>
      </div>
    </div>
  );
}
