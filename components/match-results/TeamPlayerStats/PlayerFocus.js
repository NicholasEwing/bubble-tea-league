import Image from "next/image";
import React from "react";

export default function PlayerFocus() {
  // should look like
  // div.playerinfo
  // div.matchupselector
  // div.info

  return (
    <div className="StatsMatchup absolute left-0 top-0 z-50 h-full w-full bg-[#0f1519]">
      {/* make this a component */}
      <div className="player-info flex flex-row items-center border-b bg-[#0a0e13] border-b-[#252c32] h-24">
        <div className="hide-matchup-button relative w-16 h-full flex items-center justify-center after:block after:absolute after:h-[4.5rem] after:w-[1px] after:right-0 after:top-3 after:bg-[#252c32]">
          <svg
            className="icon w-5 h-5"
            width="10px"
            height="15px"
            viewBox="0 0 10 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-320.000000, -17.000000)">
                <g transform="translate(325.000000, 24.000000) scale(-1, 1) rotate(-90.000000) translate(-325.000000, -24.000000) translate(313.000000, 12.000000)">
                  <mask fill="white">
                    <polygon points="6 7 4 9.005 11.495 16.505 19.001 9.005 17 7.005 11.501 12.504"></polygon>
                  </mask>
                  <polygon
                    className="shape"
                    fill="#687077"
                    fillRule="evenodd"
                    points="6 7 4 9.005 11.495 16.505 19.001 9.005 17 7.005 11.501 12.504"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className="StatsMatchupPlayers flex font-semibold text-[#8fa3b0] bg-[#0a0e13] flex-1">
          <div className="player primary pl-4 flex flex-row-reverse items-center flex-1">
            <div className="details flex-1 items-center pl-4">
              <div className="name text-white text-lg pb-1">100 Ssumday</div>
              <div className="champion inline text-sm uppercase">Ornn</div>
              <span className="separator px-1">–</span>
              <div className="role inline text-sm uppercase">top</div>
            </div>
            <div className="portrait basis-16 h-[60px] relative">
              <div className="wrapper w-full h-full rounded-[30px] overflow-hidden">
                <Image
                  className="image"
                  src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Ornn.png"
                  alt=""
                  layout="fixed"
                  width="60"
                  height="60"
                  style={{ transform: "scale3d(1.2, 1.2, 1.2)" }}
                />
              </div>
              <div className="level absolute -right-1 -bottom-1 w-7 h-7 pt-[3px] font-medium text-sm text-center border border-[#252c32] bg-black text-white rounded-[20px]">
                1
              </div>
            </div>
          </div>
          <div className="player secondary hidden md:block">
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
      </div>
      {/* make this a component */}
      <div className="StatsMatchupSelector text-left border-b bg-[#0a0e13] border-b-[#252c32] h-16 text-[#8fa3b0]">
        <div className="menu justify-start pl-6 flex flex-row items-center h-full">
          <div
            className="tab stats selected text-[#00c8c8] pointer-events-none flex items-center relative h-full px-4 after:absolute after:block after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-[#00c8c8]"
            data-tag="stats"
          >
            <svg
              className="icon block"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                className="shape selected fill-[#00c8c8]"
                fill="#555D64"
                d="M12.9999,18.0003 L18.9999,16.0003 L18.9999,29.0003 L12.9999,29.0003 L12.9999,18.0003 Z M3,13.9998 L9,11.9998 L9,28.9998 L3,28.9998 L3,13.9998 Z M29.0001,3 L29.0001,29 L23.0001,29 L23.0001,5 L29.0001,3 Z"
              ></path>
            </svg>
          </div>
          <div
            className="tab items flex items-center relative h-full px-4"
            data-tag="items"
          >
            <svg
              className="icon"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                className="shape"
                fill="#555d64"
                d="M15.7223667,6.4997 L5.1999,6.4997 L10.6232523,15.6773717 L15.7223667,6.4997 Z M16.2776333,6.4997 L21.3773788,15.6785075 L26.8009,6.4997 L16.2776333,6.4997 Z M21.1874171,16 L10.8139026,16 L16.0009,24.7777 L21.1874171,16 Z M2.9999,3.9997 L28.9999,3.9997 L29.9999,6.0007 L16.9999,27.9997 L14.9999,27.9997 L1.9999,6.0007 L2.9999,3.9997 Z"
              ></path>
            </svg>
          </div>
          <div
            className="tab abilities flex items-center relative h-full px-4"
            data-tag="abilities"
          >
            <svg
              className="icon"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                className="shape"
                fill="#555d64"
                d="M14,12 L18.001,6 L5,13 L2,20 L4,28 L12,30 L19,28 L26.001,14 L20,18 L30,2 L14,12 Z M7.001,20 L9.001,17 L20,12 L15,23 L12,25 L7.001,25 L7.001,20 Z"
              ></path>
            </svg>
          </div>
          <div
            className="tab runes flex items-center relative h-full px-4"
            data-tag="runes"
          >
            <svg
              className="icon"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="shape"
                fill="#555d64"
                d="M15.9997,2.0001 L28.0007,9.0001 L28.0007,23.0001 L15.9997,30.0001 L3.9997,23.0001 L3.9997,9.0001 L15.9997,2.0001 Z M6.5007,21.5641 L15.9997,27.1051 L25.4997,21.5641 L25.4997,10.4361 L15.9997,4.8941 L6.5007,10.4361 L6.5007,21.5641 Z M21,19 L16,22 L11,19 L11,13 L16,10 L21,13 L21,19 Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {/* make this a component */}
      <div className="info">
        <div className="stats">
          <div className="StatsMatchupPerformance bg-[#0f1519] flex">
            <div className="player primary flex-1 pt-5 pr-0 pb-6 pl-6">
              <div className="stat kda pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">
                  <span className="kills">0</span>
                  <span className="slash"> / </span>
                  <span className="deaths">0</span>
                  <span className="slash"> / </span>
                  <span className="assists">0</span>
                </div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  K / D / A
                </div>
              </div>
              <div className="stat goldEarned pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">0</div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  Gold Earned
                </div>
              </div>
              <div className="stat minionKills pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">0</div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  Minion Kills (CS)
                </div>
              </div>
              <div className="stat killParticipation pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">
                  0<span className="percent text-sm align-super">%</span>
                </div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  Kill Participation
                </div>
              </div>
              <div className="stat championDamageShare pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">
                  0<span className="percent text-sm align-super">%</span>
                </div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  Champion Damage Share
                </div>
              </div>
              <div className="stat wardsPlaced pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">0</div>
                <div className="title pt-1 text-[#8fa3b0] tracking-widest font-medium text-sm uppercase break-words">
                  Wards Placed
                </div>
              </div>
              <div className="stat wardsDestroyed pt-3 pr-8 pb-0 pl-0 w-1/2 float-left">
                <div className="value text-2xl font-medium text-white">0</div>
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
          <div className="StatsMatchupAttributes flex relative border-t border-t-[#252c32] bg-[#0f1519]">
            <div className="player primary flex-1 pt-8">
              <div className="stat attackDamage ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Attack Damage
                </div>
              </div>
              <div className="stat abilityPower ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Ability Power
                </div>
              </div>
              <div className="stat attackSpeed ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Attack Speed
                </div>
              </div>
              <div className="stat lifeSteal ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Life Steal
                </div>
              </div>
              <div className="stat armor ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Armor
                </div>
              </div>
              <div className="stat magicResistance ml-8 flex pt-3 pr-3 pb-3 pl-9 h-9 relative">
                <div className="value flex-1 text-white font-medium text-2xl p-0">
                  0
                </div>
                <div className="title text-[#8fa3b0] font-light flex-[3]">
                  Magic Resistance
                </div>
              </div>
            </div>
            {/* <div className="player secondary sm:hidden">
              <div className="stat attackDamage">
                <div className="value">0</div>
                <div className="title">Attack Damage</div>
              </div>
              <div className="stat abilityPower">
                <div className="value">0</div>
                <div className="title">Ability Power</div>
              </div>
              <div className="stat attackSpeed">
                <div className="value">0</div>
                <div className="title">Attack Speed</div>
              </div>
              <div className="stat lifeSteal">
                <div className="value">0</div>
                <div className="title">Life Steal</div>
              </div>
              <div className="stat armor">
                <div className="value">0</div>
                <div className="title">Armor</div>
              </div>
              <div className="stat magicResistance">
                <div className="value">0</div>
                <div className="title">Magic Resistance</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
