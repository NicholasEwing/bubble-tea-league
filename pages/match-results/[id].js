import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Op } from "sequelize";
import MatchContainer from "../../components/match-results/Containers/MatchContainer";
import MatchSection from "../../components/match-results/Containers/MatchSection";
import MatchNav from "../../components/match-results/MatchNav";
import TeamHeader from "../../components/match-results/TeamHeader";
import TeamPlayerStats from "../../components/match-results/TeamPlayerStats";
import PlayerFocus from "../../components/match-results/TeamPlayerStats/PlayerFocus";
import TeamSummary from "../../components/match-results/TeamSummary";
import { replaceTimelinePUUIDs } from "../../lib/jest-api-helpers";
import { getTimelineEvents } from "../../lib/riot-games-api-helpers";

const sequelize = require("../../sequelize/index");
const {
  Match,
  MatchRound,
  MatchRoundTeamStats,
  MatchRoundPlayerStats,
  Team,
  Player,
} = sequelize.models;

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

  let matchRounds = await MatchRound.findAll({
    where: {
      MatchId: id,
      winningTeamId: { [Op.not]: null },
      blueTeamId: { [Op.not]: null },
      redTeamId: { [Op.not]: null },
    },
    raw: true,
  });

  // add team names to matchRounds
  matchRounds = await Promise.all(
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

  let matchRoundPlayerStats = await Promise.all(
    matchRounds.map(async (round) => {
      const playerStats = await MatchRoundPlayerStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return playerStats;
    })
  );

  matchRounds = await Promise.all(
    matchRounds.map(async (round, i) => {
      const timelineEvents = await getTimelineEvents(round.gameId);
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        // get player ids
        const playerIds = matchRoundPlayerStats[0].map((player) => {
          return player.PlayerId;
        });

        // get puuids from db
        const playerPUUIDs = (
          await Player.findAll({
            where: {
              id: {
                [Op.or]: playerIds,
              },
            },
            attributes: ["PUUID"],
            raw: true,
          })
        ).map((p) => p.PUUID);

        replaceTimelinePUUIDs(timelineEvents, playerPUUIDs);
      }

      const dragonEvents = timelineEvents.info.frames.flatMap((currentFrame) =>
        currentFrame.events.filter(
          (e) => e.type === "ELITE_MONSTER_KILL" && e.monsterType === "DRAGON"
        )
      );

      const itemEvents = timelineEvents.info.frames.flatMap((currentFrame) =>
        currentFrame.events.filter(
          (e) => e.type === "ITEM_PURCHASED" || e.type === "ITEM_SOLD"
        )
      );

      const abilityLevelEvents = timelineEvents.info.frames.flatMap(
        (currentFrame) =>
          currentFrame.events.filter((e) => e.type === "SKILL_LEVEL_UP")
      );

      matchRoundPlayerStats[i].forEach((player, j) => {
        player.participantId = j + 1;
        const playerItemEvents = itemEvents.filter(
          (e) => e.participantId === player.participantId
        );

        const playerAbilityLevelEvents = abilityLevelEvents.filter(
          (e) => e.participantId === player.participantId
        );

        player.playerItemEvents = playerItemEvents;
        player.playerAbilityLevelEvents = playerAbilityLevelEvents;
      });

      return { ...round, dragonEvents, itemEvents, abilityLevelEvents };
    })
  );

  return {
    props: {
      match: JSON.parse(JSON.stringify(match)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
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
  const [toggleState, setToggleState] = useState(1);
  const [focusedPlayer, setFocusedPlayer] = useState(
    matchRoundPlayerStats[0][0]
  );
  const [comparedPlayer, setComparedPlayer] = useState(
    matchRoundPlayerStats[0][6]
  );
  const [mobileFocus, setMobileFocus] = useState(false);

  const toggleTab = (i) => {
    setToggleState(i);
  };

  const toggleMobileFocus = () => {
    setMobileFocus(!mobileFocus);
  };

  const selectPlayer = (p) => {
    setFocusedPlayer(p);
  };

  // reset player focus on desktop when changing rounds
  const resetPlayer = (roundNum) => {
    setFocusedPlayer(matchRoundPlayerStats[roundNum - 1][0]);
  };

  return (
    <div className="flex bg-[#0f1519] relative">
      <MatchContainer matchId={match.id}>
        <MatchSection>
          <TeamHeader
            tricode={matchRounds[0].blueTeamTricode}
            teamId={matchRounds[0].blueTeamId}
            teamSide="blue"
            toggleState={toggleState}
            matchRounds={matchRounds}
          />
          <span className="separator px-2 text-sm text-gray-400 font-semibold">
            VS
          </span>
          <TeamHeader
            tricode={matchRounds[0].redTeamTricode}
            teamId={matchRounds[0].redTeamId}
            teamSide="red"
            toggleState={toggleState}
            matchRounds={matchRounds}
          />
        </MatchSection>
        <MatchSection bgClass="bg-[#0a0e13]">
          <MatchNav
            matchRounds={matchRounds}
            toggleState={toggleState}
            toggleTab={toggleTab}
            resetPlayer={resetPlayer}
          />
        </MatchSection>

        <MatchSection left hideOnDesktop>
          <ul className="menu list-none	pt-1 px-2 h-full">
            <li
              className="tab title stats selected tracking-widest p-4 font-medium text-sm border-b-4 border-b-[#00c8c8] h-full grid place-items-center"
              role="button"
            >
              STATS
            </li>
          </ul>
        </MatchSection>
        <section className="team-stats relative bg-[#0a0e13] flex flex-col">
          {matchRounds.map((round, i) => (
            <React.Fragment key={i}>
              <TeamSummary
                key={`${i}-teamSummary`}
                matchRoundTeamStats={matchRoundTeamStats[i]}
                toggleState={toggleState}
                count={round.id}
                dragonEvents={round.dragonEvents}
              />
              <TeamPlayerStats
                key={`${i}-playerStats`}
                matchRoundPlayerStats={matchRoundPlayerStats[i]}
                toggleState={toggleState}
                count={round.id}
                selectPlayer={selectPlayer}
                toggleMobileFocus={toggleMobileFocus}
              />
            </React.Fragment>
          ))}
        </section>
      </MatchContainer>
      <PlayerFocus
        key={focusedPlayer.summonerName}
        player={focusedPlayer}
        selectPlayer={selectPlayer}
        comparedPlayer={comparedPlayer}
        mobileFocus={mobileFocus}
        toggleMobileFocus={toggleMobileFocus}
      />
    </div>
  );
}
