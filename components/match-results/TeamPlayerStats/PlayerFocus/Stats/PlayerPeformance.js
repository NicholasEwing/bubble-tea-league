import React from "react";
import { kFormatter } from "../../../../../lib/utils";

export default function PlayerPeformance({
  kills,
  deaths,
  assists,
  goldEarned,
  totalMinionsKilled,
  killParticipation,
  teamDamagePercentage,
  wardsPlaced,
  wardTakedowns,
  isPrimary,
}) {
  return (
    <div className="player primary flex-1 pt-5 pr-0 pb-6 pl-6 xl:border-r-[#252c32] xl:border-r">
      <div
        className={`stat kda pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          <span className="kills">{kills}</span>
          <span className="slash"> / </span>
          <span className="deaths">{deaths}</span>
          <span className="slash"> / </span>
          <span className="assists">{assists}</span>
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          K / D / A
        </div>
      </div>
      <div
        className={`stat goldEarned pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {kFormatter(goldEarned)}
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Gold Earned
        </div>
      </div>
      <div
        className={`stat minionKills pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {totalMinionsKilled}
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Minion Kills (CS)
        </div>
      </div>
      <div
        className={`stat killsParticipation pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {killParticipation}
          <span className="percent text-sm align-super">%</span>
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Kill Participation
        </div>
      </div>
      <div
        className={`stat championDamageShare pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {teamDamagePercentage}
          <span className="percent text-sm align-super">%</span>
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Champion Damage Share
        </div>
      </div>
      <div
        className={`stat wardsPlaced pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {wardsPlaced}
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Wards Placed
        </div>
      </div>
      <div
        className={`stat wardsDestroyed pt-3 pr-8 pb-0 pl-0 w-1/2 float-left ${
          isPrimary ? "xl:float-right" : ""
        }`}
      >
        <div className="value text-2xl font-medium text-white">
          {wardTakedowns}
        </div>
        <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
          Wards Destroyed
        </div>
      </div>
    </div>
  );
}
