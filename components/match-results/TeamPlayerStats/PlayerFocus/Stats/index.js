import React from "react";
import { kFormatter } from "../../../../../lib/utils";

export default function Stats({ player, comparedPlayer }) {
  return (
    <div className="stats">
      <div className="StatsMatchupPerformance bg-[#0f1519] flex">
        <div className="player primary flex-1 pt-5 pr-0 pb-6 pl-6">
          <div className="stat kda pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              <span className="kills">{player.kills}</span>
              <span className="slash"> / </span>
              <span className="deaths">{player.deaths}</span>
              <span className="slash"> / </span>
              <span className="assists">{player.assists}</span>
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              K / D / A
            </div>
          </div>
          <div className="stat goldEarned pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {kFormatter(player.goldEarned)}
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Gold Earned
            </div>
          </div>
          <div className="stat minionKills pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {player.totalMinionsKilled}
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Minion Kills (CS)
            </div>
          </div>
          <div className="stat killParticipation pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {player.killParticipation}
              <span className="percent text-sm align-super">%</span>
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Kill Participation
            </div>
          </div>
          <div className="stat championDamageShare pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {player.teamDamagePercentage}
              <span className="percent text-sm align-super">%</span>
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Champion Damage Share
            </div>
          </div>
          <div className="stat wardsPlaced pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {player.wardsPlaced}
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Wards Placed
            </div>
          </div>
          <div className="stat wardsDestroyed pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
            <div className="value text-2xl font-medium text-white">
              {player.wardTakedowns}
            </div>
            <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
              Wards Destroyed
            </div>
          </div>
        </div>
        {/* <div className="player secondary hidden md:block">
              <div className="stat kda">
                <div className="value">
                  <span className="kills">0</span>
                  <span className="slash"> / </span>
                  <span className="deaths">0</span>
                  <span className="slash"> / </span>
                  <span className="assists">0</span>
                </div>
                <div className="title">K / D / A</div>
              </div>
              <div className="stat goldEarned">
                <div className="value">0</div>
                <div className="title">Gold Earned</div>
              </div>
              <div className="stat minionKills">
                <div className="value">0</div>
                <div className="title">Minion Kills (CS)</div>
              </div>
              <div className="stat killParticipation">
                <div className="value">
                  0<span className="percent">%</span>
                </div>
                <div className="title">Kill Participation</div>
              </div>
              <div className="stat championDamageShare">
                <div className="value">
                  0<span className="percent">%</span>
                </div>
                <div className="title">Champion Damage Share</div>
              </div>
              <div className="stat wardsPlaced">
                <div className="value">0</div>
                <div className="title">Wards Placed</div>
              </div>
              <div className="stat wardsDestroyed">
                <div className="value">0</div>
                <div className="title">Wards Destroyed</div>
              </div>
            </div> */}
      </div>
      <div className="StatsMatchupAttributes flex border-t border-t-[#252c32] bg-[#0f1519]">
        <div className="player primary flex flex-col flex-1 py-8 xl:border-r-[#252c32] xl:border-r xl:pr-6">
          <div className="stat attackDamage ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-28px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.attackDamage}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Attack Damage
            </div>
          </div>
          <div className="stat abilityPower ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-28px] before:[background-position-y:-28px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.abilityPower}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Ability Power
            </div>
          </div>
          <div className="stat attackSpeed ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-100px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.attackSpeed}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Attack Speed
            </div>
          </div>
          <div className="stat lifeSteal ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-148px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.lifesteal}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Life Steal
            </div>
          </div>
          <div className="stat armor ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-52px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.armor}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Armor
            </div>
          </div>
          <div className="stat magicResistance ml-8 flex xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:border-none items-center pt-3 pr-3 pb-3 pl-9 h-9 relative before:absolute before:[background-position-x:-28px] before:[background-position-y:-52px] before:left-0 before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {player.magicResist}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Magic Resistance
            </div>
          </div>
        </div>
        <div className="player secondary hidden xl:flex-1 xl:block xl:pl-6 py-8">
          <div className="stat attackDamage mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-28px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0 ">
              {comparedPlayer.attackDamage}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Attack Damage
            </div>
          </div>
          <div className="stat abilityPower mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-28px] before:[background-position-y:-28px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0 ">
              {comparedPlayer.abilityPower}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Ability Power
            </div>
          </div>
          <div className="stat attackSpeed mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-100px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0 ">
              {comparedPlayer.attackSpeed}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Attack Speed
            </div>
          </div>
          <div className="stat lifeSteal mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-148px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {comparedPlayer.lifesteal}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Life Steal
            </div>
          </div>
          <div className="stat armor mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-4px] before:[background-position-y:-52px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {comparedPlayer.armor}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Armor
            </div>
          </div>
          <div className="stat magicResistance mr-8 flex text-left items-center pt-3 pl-3 pb-3 pr-9 h-9 relative before:absolute before:[background-position-x:-28px] before:[background-position-y:-52px] before:-left-[2.15rem] before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes">
            <div className="value flex-1 text-white font-medium text-2xl p-0">
              {comparedPlayer.magicResist}
            </div>
            <div className="title text-[#8fa3b0] font-light flex-[3]">
              Magic Resistance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
