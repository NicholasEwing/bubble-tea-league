import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Op } from "sequelize";
import MatchContainer from "../../components/match-results/Containers/MatchContainer";
import MatchSection from "../../components/match-results/Containers/MatchSection";
import MatchNav from "../../components/match-results/MatchNav";
import TeamHeader from "../../components/match-results/TeamHeader";
import TeamPlayerStats from "../../components/match-results/TeamPlayerStats";
import PlayerFocus from "../../components/match-results/TeamPlayerStats/PlayerFocus";
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
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (i) => {
    setToggleState(i);
  };
  return (
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
        />
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
      <section className="team-stats relative bg-[#0a0e13] flex flex-col">
        <PlayerFocus />
        {matchRounds.map((round, i) => (
          <React.Fragment key={i}>
            <PlayerFocus key={round.id} />
            <TeamSummary
              key={`${i}-teamSummary`}
              matchRoundTeamStats={matchRoundTeamStats[i]}
              toggleState={toggleState}
              count={round.id}
            />
            <TeamPlayerStats
              key={`${i}-playerStats`}
              matchRoundPlayerStats={matchRoundPlayerStats[i]}
              toggleState={toggleState}
              count={round.id}
            />
          </React.Fragment>
        ))}
      </section>
    </MatchContainer>
  );
}
