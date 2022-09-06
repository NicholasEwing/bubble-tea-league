// import Image from "next/image";
// import React, { useState } from "react";
// import { Op } from "sequelize";
// import MatchContainer from "../../components/match-results/Containers/MatchContainer";
// import MatchSection from "../../components/match-results/Containers/MatchSection";
// import MatchNav from "../../components/match-results/MatchNav";
// import TeamHeader from "../../components/match-results/TeamHeader";
// import TeamPlayerStats from "../../components/match-results/TeamPlayerStats";
// import PlayerFocus from "../../components/match-results/TeamPlayerStats/PlayerFocus";
// import TeamSummary from "../../components/match-results/TeamSummary";
// import { replaceTimelinePUUIDs } from "../../lib/jest-api-helpers";
// import { getTimelineEvents } from "../../lib/riot-games-api-helpers";
// import sequelize from "../../sequelize";
// const {
//   Match,
//   MatchRound,
//   MatchRoundTeamStats,
//   MatchRoundPlayerStats,
//   Team,
//   Player,
// } = sequelize.models;

// export const getStaticPaths = async () => {
//   const matches = await Match?.findAll({ raw: true });

//   // Only generate match pages that have
//   // FINISHED match rounds associated with them
//   const matchIds = matches?.map((m) => m.id);

//   const results = await MatchRound.findAll({
//     where: {
//       MatchId: { [Op.in]: matchIds },
//       winningTeamId: { [Op.not]: null },
//       blueTeamId: { [Op.not]: null },
//       redTeamId: { [Op.not]: null },
//     },
//     attributes: { exclude: ["metaData"] },
//     raw: true,
//   });

//   if (!matches || !results) {
//     return {
//       paths: [],
//       fallback: false,
//     };
//   }

//   const pagesToGenerate = [
//     ...new Set(results.flatMap((result) => result.MatchId)),
//   ];

//   const paths = pagesToGenerate.reduce((acc, elem) => {
//     acc.push({ params: { id: elem.toString() } });
//     return acc;
//   }, []);

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps = async (context) => {
//   const { id } = context.params;
//   const match = await Match.findByPk(id, { raw: true });

//   let matchRounds = await MatchRound.findAll({
//     where: {
//       MatchId: id,
//       winningTeamId: { [Op.not]: null },
//       blueTeamId: { [Op.not]: null },
//       redTeamId: { [Op.not]: null },
//     },
//     attributes: { exclude: ["metaData"] },
//     raw: true,
//   });

//   if (!match || !matchRounds) {
//     return {
//       notFound: true,
//     };
//   }

//   // add team names to matchRounds
//   matchRounds = await Promise.all(
//     matchRounds.map(async (round) => {
//       const { blueTeamId, redTeamId, winningTeamId } = round;
//       const teams = await Team.findAll({
//         attributes: ["id", "teamName", "tricode"],
//         raw: true,
//       });
//       const blueTeam = teams.find((team) => team.id === blueTeamId);
//       const redTeam = teams.find((team) => team.id === redTeamId);
//       const winningTeam = teams.find((team) => team.id === winningTeamId);
//       const losingTeam = teams.find(
//         (team) =>
//           team.id !== winningTeamId &&
//           (team.id === blueTeamId || team.id === redTeamId)
//       );

//       return {
//         ...round,
//         blueTeamName: blueTeam.teamName,
//         blueTeamTricode: blueTeam.tricode,
//         redTeamName: redTeam.teamName,
//         redTeamTricode: redTeam.tricode,
//         winningTeamName: winningTeam.teamName,
//         losingTeamName: losingTeam.teamName,
//         losingTeamTricode: losingTeam.tricode,
//         losingTeamId: losingTeam.id,
//       };
//     })
//   );

//   const matchRoundTeamStats = await Promise.all(
//     matchRounds.map(async (round) => {
//       const teamStats = await MatchRoundTeamStats.findAll({
//         where: { MatchRoundId: round.id },
//         raw: true,
//       });

//       return teamStats;
//     })
//   );

//   let matchRoundPlayerStats = await Promise.all(
//     matchRounds.map(async (round) => {
//       const playerStats = await MatchRoundPlayerStats.findAll({
//         where: { MatchRoundId: round.id },
//         raw: true,
//       });

//       return playerStats;
//     })
//   );

//   matchRounds = await Promise.all(
//     matchRounds.map(async (round, i) => {
//       const timelineEvents = await getTimelineEvents(round.gameId);
//       if (
//         process.env.NODE_ENV === "development" ||
//         process.env.NODE_ENV === "test"
//       ) {
//         // get player ids
//         const playerIds = matchRoundPlayerStats[0].map((player) => {
//           return player.PlayerId;
//         });

//         // get puuids from db
//         const playerPUUIDs = (
//           await Player.findAll({
//             where: {
//               id: {
//                 [Op.or]: playerIds,
//               },
//             },
//             attributes: ["PUUID"],
//             raw: true,
//           })
//         ).map((p) => p.PUUID);

//         replaceTimelinePUUIDs(timelineEvents, playerPUUIDs);
//       }

//       const dragonEvents = timelineEvents.info.frames.flatMap((currentFrame) =>
//         currentFrame.events.filter(
//           (e) => e.type === "ELITE_MONSTER_KILL" && e.monsterType === "DRAGON"
//         )
//       );

//       const itemEvents = timelineEvents.info.frames.flatMap((currentFrame) =>
//         currentFrame.events.filter(
//           (e) => e.type === "ITEM_PURCHASED" || e.type === "ITEM_SOLD"
//         )
//       );

//       const abilityLevelEvents = timelineEvents.info.frames.flatMap(
//         (currentFrame) =>
//           currentFrame.events.filter((e) => e.type === "SKILL_LEVEL_UP")
//       );

//       matchRoundPlayerStats[i].forEach((player, j) => {
//         player.participantId = j + 1;
//         const playerItemEvents = itemEvents.filter(
//           (e) => e.participantId === player.participantId
//         );

//         const playerAbilityLevelEvents = abilityLevelEvents.filter(
//           (e) => e.participantId === player.participantId
//         );

//         player.playerItemEvents = playerItemEvents;
//         player.playerAbilityLevelEvents = playerAbilityLevelEvents;
//       });

//       return { ...round, dragonEvents, itemEvents, abilityLevelEvents };
//     })
//   );

//   return {
//     props: {
//       match: JSON.parse(JSON.stringify(match)),
//       matchRounds: JSON.parse(JSON.stringify(matchRounds)),
//       matchRoundTeamStats: JSON.parse(JSON.stringify(matchRoundTeamStats)),
//       matchRoundPlayerStats: JSON.parse(JSON.stringify(matchRoundPlayerStats)),
//     },
//   };
// };

// export default function MatchResults({
//   match = null,
//   matchRounds = null,
//   matchRoundTeamStats = null,
//   matchRoundPlayerStats = null,
// }) {
//   const [toggleState, setToggleState] = useState(1);

//   // on bigger screens, compare both players
//   const [focusedPlayerRow, setFocusedPlayerRow] = useState([
//     matchRoundPlayerStats[0][0],
//     matchRoundPlayerStats[0][5],
//   ]);

//   // on smaller screens, show the individually CLICKED player
//   const [focusedPlayer, setFocusedPlayer] = useState(
//     matchRoundPlayerStats[0][0]
//   );

//   const [mobileFocus, setMobileFocus] = useState(false);

//   const toggleTab = (i) => {
//     setToggleState(i);
//   };

//   const toggleMobileFocus = () => {
//     setMobileFocus(!mobileFocus);
//   };

//   const selectFocusedPlayerRow = (player, players) => {
//     setFocusedPlayer(player); // track clicked player
//     setFocusedPlayerRow(players); // track row of click players
//   };

//   // reset player focus on desktop when changing rounds
//   const resetPlayers = (roundNum) => {
//     const firstBluePlayer = matchRoundPlayerStats[roundNum - 1][0];
//     const firstRedPlayer = matchRoundPlayerStats[roundNum - 1][5];
//     selectFocusedPlayerRow(firstBluePlayer, [firstBluePlayer, firstRedPlayer]);
//   };

//   return (
//     <div className="relative flex bg-[#0f1519]">
//       <MatchContainer matchId={match.id}>
//         <MatchSection>
//           <TeamHeader
//             tricode={matchRounds[0].blueTeamTricode}
//             teamId={matchRounds[0].blueTeamId}
//             teamSide="blue"
//             toggleState={toggleState}
//             matchRounds={matchRounds}
//           />
//           <span className="separator px-2 text-sm font-semibold text-gray-400">
//             VS
//           </span>
//           <TeamHeader
//             tricode={matchRounds[0].redTeamTricode}
//             teamId={matchRounds[0].redTeamId}
//             teamSide="red"
//             toggleState={toggleState}
//             matchRounds={matchRounds}
//           />
//         </MatchSection>
//         <MatchSection bgClass="bg-[#0a0e13]">
//           <MatchNav
//             matchRounds={matchRounds}
//             toggleState={toggleState}
//             toggleTab={toggleTab}
//             resetPlayers={resetPlayers}
//           />
//         </MatchSection>

//         <MatchSection left hideOnDesktop>
//           <ul className="menu h-full	list-none px-2 pt-1">
//             <li
//               className="tab title stats selected grid h-full place-items-center border-b-4 border-b-teal-accent p-4 text-sm font-medium tracking-widest"
//               role="button"
//             >
//               STATS
//             </li>
//           </ul>
//         </MatchSection>
//         <section className="team-stats relative flex flex-col bg-[#0a0e13]">
//           {matchRounds.map((round, i) => (
//             <React.Fragment key={i}>
//               <TeamSummary
//                 key={`${i}-teamSummary`}
//                 matchRoundTeamStats={matchRoundTeamStats[i]}
//                 toggleState={toggleState}
//                 count={i + 1}
//                 dragonEvents={round.dragonEvents}
//               />
//               <TeamPlayerStats
//                 key={`${i}-playerStats`}
//                 matchRoundPlayerStats={matchRoundPlayerStats[i]}
//                 toggleState={toggleState}
//                 count={i + 1}
//                 selectFocusedPlayerRow={selectFocusedPlayerRow}
//                 focusedPlayerRow={focusedPlayerRow}
//                 focusedPlayer={focusedPlayer}
//                 toggleMobileFocus={toggleMobileFocus}
//               />
//             </React.Fragment>
//           ))}
//         </section>
//       </MatchContainer>
//       {focusedPlayerRow[0] && (
//         <PlayerFocus
//           key={focusedPlayerRow[0].summonerName}
//           focusedPlayer={focusedPlayer}
//           focusedPlayerRow={focusedPlayerRow}
//           selectFocusedPlayerRow={selectFocusedPlayerRow}
//           mobileFocus={mobileFocus}
//           toggleMobileFocus={toggleMobileFocus}
//         />
//       )}
//     </div>
//   );
// }
