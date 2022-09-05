import React, { useState } from "react";
import SeasonSelector from "../components/admin/Sections/PlayersSection/SeasonSelector";
import SectionContainer from "../components/admin/table/SectionContainer";
import { findTeamName, percentageFormatter } from "../lib/utils";
import EditableTable from "../components/admin/EditableTable";
import TextHeadingContainer from "../components/admin/TextHeadingContainer";

export const getStaticProps = async () => {
  const { prisma } = require("../prisma/db");

  const seasons = await prisma.season.findMany();
  const teams = await prisma.team.findMany();
  const players = await prisma.player.findMany();
  const playerTeamHistories = await prisma.playerTeamHistory.findMany();
  const matches = await prisma.match.findMany();
  const matchRounds = await prisma.matchRound.findMany();
  const matchRoundTeamStats = await prisma.matchRoundTeamStats.findMany();
  const matchRoundPlayerStats = await prisma.matchRoundPlayerStats.findMany();

  // calculates the avg of anything per game for a player, (avg damage, avg cs, avg deaths, etc)
  function calculateStatPerMin(
    PlayerId,
    playerTeamMatchRounds,
    playerMatches,
    statKey,
    gamesPlayed
  ) {
    const avgStatPerGame = playerTeamMatchRounds.map((mr) => {
      const gameTime = mr.gameDuration;

      const matchRoundId = mr.id;
      const playerMatch = playerMatches.find(
        (m) => m.playerId === playerId && m.matchRoundId === matchRoundId
      );
      const gameStat = playerMatch[statKey];

      return gameStat / gameTime;
    });

    const totalAvgStatPerGame = avgStatPerGame.reduce(
      (totalAvgStatPerGame, avgStatPerGame) =>
        (totalAvgStatPerGame += avgStatPerGame),
      0
    );

    const statPerMin = totalAvgStatPerGame / gamesPlayed;
    return Math.round(statPerMin * 100) / 100;
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  const seasonRows = [];
  for (const season of seasons) {
    const seasonRow = [];

    // parse a player's seasonal stats in a big object
    for (const history of playerTeamHistories) {
      const { playerId, teamId, role } = history;
      const player = players.find((p) => p.id === playerId);
      const team = findTeamName(teamId, teams);
      const { summonerName } = player;

      // find all finished match ids for the season with this player's team in it
      const seasonMatches = matches.filter(
        (m) =>
          m.season === season.id &&
          m.matchWinnerTeamId &&
          (m.teamOne === teamId || m.teamTwo === teamId)
      );

      // no matches yet? skip this player
      if (!seasonMatches.length) break;

      const seasonMatchIds = seasonMatches.map((m) => m.id);
      const seasonMatchRounds = matchRounds.filter((mr) =>
        seasonMatchIds.includes(mr.matchId)
      );
      const seasonMatchRoundIds = seasonMatchRounds.map((mr) => mr.id);

      // all match rounds with this player's team involved that have a winner
      const playerTeamMatchRounds = matchRounds.filter(
        (mr) =>
          (mr.redTeamId === teamId || mr.blueTeamId === teamId) &&
          mr.winningTeamId
      );

      // filter down to stat records for this player and their team
      const playerMatches = matchRoundPlayerStats.filter(
        (mrps) =>
          seasonMatchRoundIds.includes(mrps.matchRoundId) &&
          mrps.playerId === playerId
      );
      const teamMatches = matchRoundTeamStats.filter(
        (mrts) => mrts.teamId === teamId
      );

      const kills = playerMatches.reduce(
        (kills, stats) => (kills += stats.kills),
        0
      );
      const deaths = playerMatches.reduce(
        (deaths, stats) => (deaths += stats.deaths),
        0
      );
      const assists = playerMatches.reduce(
        (assists, stats) => (assists += stats.assists),
        0
      );
      const totalCs = playerMatches
        .reduce(
          (totalMinionsKilled, stats) =>
            (totalMinionsKilled += stats.totalMinionsKilled),
          0
        )
        .toLocaleString("en-US");
      const gamesPlayed = playerMatches.length;
      const averageGameTimeSeconds =
        playerTeamMatchRounds.reduce(
          (time, match) => (time += match.gameDuration),
          0
        ) / gamesPlayed;
      const minutes = Math.floor(averageGameTimeSeconds / 60);
      const seconds = Math.floor(averageGameTimeSeconds % 60);

      const averageGameTime = `${padTo2Digits(minutes)}:${padTo2Digits(
        seconds
      )}`;

      const creepsPerMin = calculateStatPerMin(
        PlayerId,
        playerTeamMatchRounds,
        playerMatches,
        "totalMinionsKilled",
        gamesPlayed
      );

      const totalGold = playerMatches
        .reduce((gold, stats) => (gold += stats.goldEarned), 0)
        .toLocaleString("en-US");

      const goldPerMin = calculateStatPerMin(
        playerId,
        playerTeamMatchRounds,
        playerMatches,
        "goldEarned",
        gamesPlayed
      );
      const visionScore = playerMatches.reduce(
        (vs, stats) => (vs += stats.visionScore),
        0
      );
      const visionScorePerGame =
        Math.round((visionScore / gamesPlayed) * 100) / 100;
      const visionScorePerMin = calculateStatPerMin(
        playerId,
        playerTeamMatchRounds,
        playerMatches,
        "visionScore",
        gamesPlayed
      );
      const avgTeamPercentDmg =
        Math.round(
          (playerMatches.reduce((teamPercentDmg, match) => {
            return (teamPercentDmg += parseInt(match.teamDamagePercentage));
          }, 0) /
            gamesPlayed) *
            100
        ) / 100;

      const kda = playerMatches.reduce((kda, stats) => (kda += stats.kda), 0);

      const killParticipationPercent = percentageFormatter(
        (kills + assists) /
          teamMatches.reduce(
            (teamKills, match) => (teamKills += match.kills),
            0
          )
      );
      const totalDmgToChamps = playerMatches
        .reduce((dmg, stats) => (dmg += stats.totalDmgToChamps), 0)
        .toLocaleString("en-US");
      const dmgToChampsPerMin = calculateStatPerMin(
        playerId,
        playerTeamMatchRounds,
        playerMatches,
        "totalDmgToChamps",
        gamesPlayed
      );

      const firstBloods = playerMatches.reduce(
        (fbs, stats) => (fbs += stats.firstBlood),
        0
      );

      const playerStatRow = {
        season: season.id,
        summonerName,
        role,
        team,
        kills,
        deaths,
        assists,
        totalCs,
        gamesPlayed,
        averageGameTime,
        totalDmgToChamps,
        creepsPerMin,
        totalGold,
        dmgToChampsPerMin,
        avgTeamPercentDmg,
        visionScore,
        visionScorePerGame,
        visionScorePerMin,
        killParticipationPercent,
        goldPerMin,
        kda,
        firstBloods,
      };

      // each item in here represent's a player's stat (or one row on the table)
      seasonRow.push(playerStatRow);
    }

    // each item in here represents a season
    seasonRows.push(seasonRow);
  }

  return {
    props: {
      seasons: JSON.parse(JSON.stringify(seasons)),
      seasonRows: JSON.parse(JSON.stringify(seasonRows)),
    },
  };
};

export default function PlayerStats({ seasons = null, seasonRows = null }) {
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.number || 1);

  const rowsToDisplay = seasonRows[activeSeason - 1] || [];

  const handleActiveSeason = (number) => {
    setActiveSeason(number);
  };

  // define columns
  const playerStatsColumns = [
    {
      valueKey: "summonerName",
      name: "Summoner Name",
    },
    {
      valueKey: "role",
      name: "Role",
      small: true,
    },
    {
      valueKey: "team",
      name: "Team",
      small: true,
    },
    {
      valueKey: "kills",
      name: "Kills",
      small: true,
    },
    {
      valueKey: "deaths",
      name: "Deaths",
      small: true,
    },
    {
      valueKey: "assists",
      name: "Assists",
      small: true,
    },
    {
      valueKey: "totalCs",
      name: "Total CS",
      small: true,
    },
    {
      valueKey: "gamesPlayed",
      name: "Games Played",
      small: true,
    },
    {
      valueKey: "averageGameTime",
      name: "Avg Game Time",
      small: true,
    },
    {
      valueKey: "totalDmgToChamps",
      name: "Total Dmg To Champs",
    },
    {
      valueKey: "creepsPerMin",
      name: "CS / Min",
      small: true,
    },
    {
      valueKey: "totalGold",
      name: "Total Gold",
      small: true,
    },
    {
      valueKey: "dmgToChampsPerMin",
      name: "Dmg to Champs / Min",
      small: true,
    },
    {
      valueKey: "avgTeamPercentDmg",
      name: "Avg Team % Dmg",
      small: true,
    },
    {
      valueKey: "visionScore",
      name: "Vision Score",
      small: true,
    },
    {
      valueKey: "visionScorePerGame",
      name: "Vision Score Per Game",
      small: true,
    },
    {
      valueKey: "visionScorePerMin",
      name: "Vision Score / Min",
      small: true,
    },
    {
      valueKey: "killParticipationPercent",
      name: "Kill Participation %",
      small: true,
    },
    {
      valueKey: "goldPerMin",
      name: "Gold / Min",
      small: true,
    },
    {
      valueKey: "kda",
      name: "KDA",
      small: true,
    },
    {
      valueKey: "firstBloods",
      name: "First Bloods",
      small: true,
    },
  ];

  return (
    <div className="py-8 px-4">
      <SectionContainer>
        <TextHeadingContainer>
          <h1 className="text-xl font-semibold text-white">
            Seasonal Player Stats
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            This table shows stats across a player&apos;s entire season game
            history. Some numbers are totals that are simply added, such as
            kills, deaths, and assists. Others may be averages, percentages or
            per-minute stats.
          </p>
        </TextHeadingContainer>
        {seasons.length > 0 && (
          <SeasonSelector
            seasons={seasons}
            activeSeason={activeSeason}
            handleActiveSeason={handleActiveSeason}
          />
        )}
        <EditableTable
          items={rowsToDisplay}
          columns={playerStatsColumns}
          tableName="player-stats"
          isPublic
        />
      </SectionContainer>
    </div>
  );
}
