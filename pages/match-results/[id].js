import Image from "next/image";
import { useRouter } from "next/router";
import { Op } from "sequelize";
import MatchContainer from "../../components/match-results/Containers/MatchContainer";
import MatchSection from "../../components/match-results/Containers/MatchSection";
import TeamHeader from "../../components/match-results/TeamHeader";
import TeamSummary from "../../components/match-results/TeamSummary";
const sequelize = require("../../sequelize/index");
const { Match, MatchRound, MatchRoundTeamStats, MatchRoundPlayerStats, Team } =
  sequelize.models;

export const getStaticPaths = async () => {
  const matches = await Match.findAll({ raw: true });

  const paths = matches.map((match) => {
    return {
      params: { id: match.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const match = await Match.findByPk(id, { raw: true });

  const matchRounds = await MatchRound.findAll({
    where: {
      MatchId: id,
      winningTeamId: { [Op.not]: null },
      blueTeamId: { [Op.not]: null },
      redTeamId: { [Op.not]: null },
    },
    raw: true,
  });

  // find team names
  const roundsWithTeamNames = await Promise.all(
    matchRounds.map(async (round) => {
      const { blueTeamId, redTeamId, winningTeamId } = round;
      const teams = await Team.findAll({
        attributes: ["id", "teamName", "tricode"],
        raw: true,
      });
      const blueTeam = teams.find((team) => team.id === blueTeamId);
      const redTeam = teams.find((team) => team.id === redTeamId);
      const winningTeam = teams.find((team) => team.id === winningTeamId);
      const losingTeam = teams.find(
        (team) =>
          team.id !== winningTeamId &&
          (team.id === blueTeamId || team.id === redTeamId)
      );

      return {
        ...round,
        blueTeamName: blueTeam.teamName,
        blueTeamTricode: blueTeam.tricode,
        redTeamName: redTeam.teamName,
        redTeamTricode: redTeam.tricode,
        winningTeamName: winningTeam.teamName,
        losingTeamName: losingTeam.teamName,
        losingTeamTricode: losingTeam.tricode,
        losingTeamId: losingTeam.id,
      };
    })
  );

  const matchRoundTeamStats = await Promise.all(
    matchRounds.map(async (round) => {
      const teamStats = await MatchRoundTeamStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return teamStats;
    })
  );

  const matchRoundPlayerStats = await Promise.all(
    matchRounds.map(async (round) => {
      const playerStats = await MatchRoundPlayerStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return playerStats;
    })
  );

  return {
    props: {
      match: JSON.parse(JSON.stringify(match)),
      matchRounds: JSON.parse(JSON.stringify(roundsWithTeamNames)),
      matchRoundTeamStats: JSON.parse(JSON.stringify(matchRoundTeamStats)),
      matchRoundPlayerStats: JSON.parse(JSON.stringify(matchRoundPlayerStats)),
    },
  };
};

export default function MatchResults({
  match,
  matchRounds,
  matchRoundTeamStats,
  matchRoundPlayerStats,
}) {
  return (
    <MatchContainer matchId={match.id}>
      <MatchSection>
        <TeamHeader tricode={matchRounds[0].blueTeamTricode} teamSide="blue" />
        <span className="separator px-2 text-sm text-gray-400 font-semibold">
          VS
        </span>
        <TeamHeader tricode={matchRounds[0].redTeamTricode} teamSide="red" />
      </MatchSection>
      <MatchSection bgClass="bg-[#0a0e13]">
        <span className="label text-[#8fa3b0] font-semibold pr-8">GAME</span>
        <a
          href="#"
          className="px-8 text-[#00c8c8] active pointer-events-none font-semibold"
        >
          1
        </a>
        <a href="#" className="px-8 text-[#687077] font-semibold">
          2
        </a>
        <a href="#" className="px-8 text-[#687077] font-semibold">
          3
        </a>
      </MatchSection>
      <MatchSection left>
        <ul className="menu list-none	pt-1 px-2 h-full">
          <li
            className="tab title stats selected tracking-widest p-4 font-medium text-sm border-b-4 border-b-[#00c8c8] h-full grid place-items-center"
            role="button"
          >
            STATS
          </li>
        </ul>
      </MatchSection>
      <section className="team-stats bg-[#0a0e13] flex flex-col">
        <TeamSummary matchRoundTeamStats={matchRoundTeamStats[0]} />
        <section className="player-stats relative bg-[#0a0e13] text-white flex flex-col cursor-pointer">
          <div className="blue-team flex flex-col flex-1 border-r border-r-[#252c32]">
            <div
              role="button"
              className="player top p-4 pr-0 h-32 flex flex-wrap text-lg border-b border-b-[#252c32]"
            >
              <div className="name basis-full pb-1 font-bold">TL Bwipo</div>
              <div className="portrait relative basis-16 h-16 w-16 before:block before:absolute before:-left- before:-top-1 before:-right-1 before:-bottom-1 before:z-1 before:rounded-3xl before:border-[3px] before:border-[#0a0e13]">
                <div className="wrapper h-full w-full bg-[#333] rounded-3xl overflow-hidden relative z-[1]">
                  <Image
                    className="image inline-block h-full w-full m-0"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Aatrox.png"
                    alt=""
                    width="60"
                    height="60"
                    style={{ transform: "scale3d(1.1,1.1,1.1)" }}
                  />
                </div>
                <div className="level absolute -l-2 -b-2 bg-black rounded-2xl pt-1 text-center w-6 h-6 text-lg font-semibold border border-[#252c32] overflow-hidden z-2">
                  8
                </div>
              </div>
              <div className="details pl-1 flex flex-1">
                <div className="stat kda">
                  <svg
                    className="icon float-left clear-left mx-1 mt-[2px] mb-0 inline-block align-bottom leading-5"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills ">0</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">0</span>
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
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  78
                </div>
                <div className="stat gold">
                  <svg
                    className="icon float-left clear-left mx-1 mt-[2px] mb-0 inline-block align-bottom leading-5"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.9 K
                </div>
              </div>
            </div>
            <div role="button" className="player jungle">
              <div className="name">TL Santorin</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/JarvanIV.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">0</span>&nbsp;/&nbsp;
                  <span className="deaths">1</span>&nbsp;/&nbsp;
                  <span className="assists">2</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  58
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.9 K
                </div>
              </div>
            </div>
            <div role="button" className="player mid">
              <div className="name">TL Bjergsen</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Leblanc.png"
                    alt=""
                  />
                </div>
                <div className="level">8</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">1</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">1</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  80
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  3.3 K
                </div>
              </div>
            </div>
            <div role="button" className="player bottom">
              <div className="name">TL Hans sama</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Zeri.png"
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">0</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">0</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  80
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  3.0 K
                </div>
              </div>
            </div>
            <div role="button" className="player support">
              <div className="name">TL CoreJJ</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Rakan.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">1</span>&nbsp;/&nbsp;
                  <span className="deaths">1</span>&nbsp;/&nbsp;
                  <span className="assists">1</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  16
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.4 K
                </div>
              </div>
            </div>
          </div>
          <div className="red-team flex flex-1 items-end">
            <div role="button" className="player top">
              <div className="name">100 Ssumday</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Tryndamere.png"
                    alt=""
                  />
                </div>
                <div className="level">7</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">1</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">0</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  49
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.7 K
                </div>
              </div>
            </div>
            <div role="button" className="player jungle">
              <div className="name">100 Closer</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Viego.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">0</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">2</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  57
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.9 K
                </div>
              </div>
            </div>
            <div role="button" className="player mid">
              <div className="name">100 Abbedagge</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Vex.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">0</span>&nbsp;/&nbsp;
                  <span className="deaths">2</span>&nbsp;/&nbsp;
                  <span className="assists">1</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  57
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.6 K
                </div>
              </div>
            </div>
            <div role="button" className="player bottom">
              <div className="name">100 FBI</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Aphelios.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">1</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">0</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  82
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  3.4 K
                </div>
              </div>
            </div>
            <div role="button" className="player support">
              <div className="name">100 huhi</div>
              <div className="portrait">
                <div className="wrapper">
                  <img
                    className="image"
                    src="https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Leona.png"
                    alt=""
                  />
                </div>
                <div className="level">6</div>
              </div>
              <div className="details">
                <div className="stat kda">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <polygon points="8 9.43 13 5.78 13 3 10.22 3 6.57 8 6.57 8 6.57 8 6.57 9.43 4.43 7.29 3.71 9.43 4.63 10.34 3 11.97 4.03 13 5.66 11.37 6.57 12.29 8.71 11.57 6.57 9.43 8 9.43 8 9.43"></polygon>
                    </g>
                  </svg>
                  <span className="kills">0</span>&nbsp;/&nbsp;
                  <span className="deaths">0</span>&nbsp;/&nbsp;
                  <span className="assists">1</span>
                </div>
                <div className="stat cs">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      className="shape"
                      fill="#555d64"
                      d="M8.5,2h-1L3,9l5,5,5-5ZM5,8,6,7,8,9l2-2,1,1L8,12.5Z"
                    ></path>
                  </svg>
                  14
                </div>
                <div className="stat gold">
                  <svg
                    className="icon"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <g className="shape" fill="#555d64" fillRule="evenodd">
                      <path d="M13,6.86C13,8,11.21,9,9,9S5,8,5,6.86V5.14C5,4 ,6.79,3,9,3s4,1,4,2.14Z"></path>
                      <path d="M7,7.71a4,4,0,0,1,2.4.64v1.3a4,4,0,0,1-2.4.64,4 ,4,0,0,1-2.4-.64V8.35A4,4,0,0,1,7,7.71M7,6C4.79,6,3,7,3 ,8.14V9.86C3,11,4.79,12,7,12s4-1,4-2.14V8.14C11,7,9.21,6,7,6Z"></path>
                    </g>
                  </svg>
                  2.0 K
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </MatchContainer>
  );
}
