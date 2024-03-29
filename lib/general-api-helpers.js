const { generateTournamentCodes } = require("./riot-games-api-helpers");
const { percentageFormatter, sortStandings } = require("./utils");

const { teamSchema, fakeInfoGenerator } = require("./jest-api-helpers");
const { prisma } = require("@prisma/client");

// and convert it to a number (since it comes as a string by default)
function getIdParam(req) {
  const id = req.query.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

async function parseTeamStats(
  matchRoundResults,
  winningTeamId,
  losingTeamId,
  matchRoundId
) {
  // Parse winner info
  const winnerInfo = matchRoundResults.info.teams.find((team) => team.win);
  const winningTeamGoldEarned = matchRoundResults.info.participants
    .filter((p) => p.win)
    .reduce((g, w) => (g += w.goldEarned), 0);

  const matchRoundTeamStatsWinner = {
    kills: winnerInfo.objectives.champion.kills,
    goldEarned: winningTeamGoldEarned,
    towersDestroyed: winnerInfo.objectives.tower.kills,
    heraldsKilled: winnerInfo.objectives.riftHerald.kills,
    dragonsKilled: winnerInfo.objectives.dragon.kills,
    inhibitorsDestroyed: winnerInfo.objectives.inhibitor.kills,
    baronsKilled: winnerInfo.objectives.baron.kills,
    teamId: winningTeamId,
    matchRoundId,
  };

  // Parse loser info
  const loserInfo = matchRoundResults.info.teams.find(
    (team) => team.win === false
  );

  const losingTeamGoldEarned = matchRoundResults.info.participants
    .filter((p) => p.win === false)
    .reduce((g, l) => (g += l.goldEarned), 0);

  const matchRoundTeamStatsLoser = {
    kills: loserInfo.objectives.champion.kills,
    goldEarned: losingTeamGoldEarned,
    towersDestroyed: loserInfo.objectives.tower.kills,
    heraldsKilled: loserInfo.objectives.riftHerald.kills,
    dragonsKilled: loserInfo.objectives.dragon.kills,
    inhibitorsDestroyed: loserInfo.objectives.inhibitor.kills,
    baronsKilled: loserInfo.objectives.baron.kills,
    teamId: losingTeamId,
    matchRoundId,
  };

  const matchRoundTeamStatsRecords = [
    matchRoundTeamStatsWinner,
    matchRoundTeamStatsLoser,
  ];

  return matchRoundTeamStatsRecords;
}

async function parsePlayerStats(
  allPlayers,
  matchRoundId,
  matchRoundResults,
  blueTeamId,
  redTeamId,
  matchRoundTeamStatsRecords,
  timelineEvents,
  winningTeamId,
  losingTeamId,
  seasonId,
  seasonTeams
) {
  const seasonTeamIds = seasonTeams.map((st) => st.id);
  const playerIds = allPlayers.map((p) => p.id);

  try {
    const matchRoundPlayerStatsRecords = allPlayers.map((player, i) => {
      // match PUUID with participant
      const participant = matchRoundResults.info.participants.find(
        (p) => p.puuid === player.PUUID
      );

      // find the player's team
      if (i <= 5) {
        // first 5 players are winners
        const winnerKills = matchRoundTeamStatsRecords.find(
          (team) => team.teamId === winningTeamId
        ).kills;

        participant.killParticipation = percentageFormatter(
          (participant.kills + participant.assists) / winnerKills
        );
      } else {
        // last 5 players are losers
        const loserKills = matchRoundTeamStatsRecords.find(
          (team) => team.teamId === winningTeamId
        ).kills;

        participant.killParticipation = percentageFormatter(
          (participant.kills + participant.assists) / loserKills
        );
      }

      const primaryRuneInfo = participant.perks.styles.find(
        (s) => s.description === "primaryStyle"
      );
      const secondaryRuneInfo = participant.perks.styles.find(
        (s) => s.description === "subStyle"
      );

      const finalPlayerEvents =
        timelineEvents.info.frames.slice(-1)[0].participantFrames;

      const participantEndGameStats = finalPlayerEvents[i + 1];

      const {
        attackDamage,
        abilityPower,
        attackSpeed,
        lifesteal,
        armor,
        magicResist,
      } = participantEndGameStats.championStats;

      const matchRoundPlayerStatsObj = {
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        goldEarned: participant.goldEarned,
        champLevel: participant.champLevel,
        championName: participant.championName,
        championTransform: participant.championTransform,
        champLevel: participant.champLevel,
        item0: participant.item0,
        item1: participant.item1,
        item2: participant.item2,
        item3: participant.item3,
        item4: participant.item4,
        item5: participant.item5,
        item6: participant.item6,
        summoner1Id: participant.summoner1Id,
        summoner2Id: participant.summoner2Id,
        teamPosition:
          participant.teamPosition === "UTILITY"
            ? "SUPPORT"
            : participant.teamPosition,
        totalMinionsKilled: participant.totalMinionsKilled,
        visionScore: participant.visionScore,
        firstBlood: participant.firstBloodKill,
        totalDmgToChamps: participant.totalDamageDealtToChampions,
        kda: parseFloat(Math.round(participant.challenges.kda * 100) / 100),
        statPerks: JSON.stringify(participant.perks.statPerks),
        primaryRunePath: primaryRuneInfo.style,
        primaryRunePerks: JSON.stringify(primaryRuneInfo.selections),
        secondaryRunePath: secondaryRuneInfo.style,
        secondaryRunePerks: JSON.stringify(secondaryRuneInfo.selections),
        summonerName: participant.summonerName,
        killParticipation: participant.killParticipation,
        teamDamagePercentage: percentageFormatter(
          participant.challenges.teamDamagePercentage
        ),
        wardsPlaced: participant.wardsPlaced,
        wardTakedowns: participant.challenges.wardTakedowns,
        attackDamage,
        abilityPower,
        attackSpeed,
        lifesteal,
        armor,
        magicResist,
        playerId: player.id,
        teamSide: participant.teamId === 100 ? "blue" : "red",
        matchRoundId,
      };

      return matchRoundPlayerStatsObj;
    });

    return matchRoundPlayerStatsRecords;
  } catch (error) {
    console.log("Error parsing player stats.");
    console.error(error);
  }
}

const createTeams = (number, seasonId) => {
  const placeholderTeams = fakeInfoGenerator(teamSchema, number);
  // do some formatting
  return placeholderTeams.map((t) => ({
    ...t,
    tricode: t.tricode.toUpperCase(),
    seasonId: parseInt(seasonId),
  }));
};

async function seedPlayoffs(seasonId, seasonTeams) {
  const seasonTeamIds = seasonTeams.map((t) => t.id);

  const seasonalPlayoffsMatches = await prisma.match.findMany({
    where: {
      seasonId,
      isPlayoffsMatch: true,
    },
  });

  const upperBracketMatches = seasonalPlayoffsMatches.filter(
    (pom) => pom.isUpperBracket
  );
  const lowerBracketMatches = seasonalPlayoffsMatches.filter(
    (pom) => !pom.isUpperBracket
  );

  // top 2 get a bye into Upper Bracket Round 2
  const roundTwoUpperBracketMatches = upperBracketMatches.filter(
    (m) => m.bracketRound === 2
  );
  for (const [i, match] of roundTwoUpperBracketMatches.entries()) {
    const teamId = seasonTeamIds[i];
    await prisma.match.update({
      where: { id: match.id },
      data: {
        matchWinnerTeamId: teamId,
        teamOneId: teamId,
      },
    });
  }

  // 3 - 6 go into Upper Bracket Round 1
  const roundOneUpperBracketMatches = upperBracketMatches.filter(
    (m) => m.bracketRound === 1
  );
  await prisma.match.update({
    where: {
      id: roundOneUpperBracketMatches[0].id,
    },
    data: {
      teamOne: seasonTeamIds[2],
      teamTwo: seasonTeamIds[3],
    },
  });
  await prisma.match.update({
    where: {
      id: roundOneUpperBracketMatches[1],
    },
    data: {
      teamOne: seasonTeamIds[4],
      teamTwo: seasonTeamIds[5],
    },
  });

  // 7 - 10 go into Lower Bracket Round 1
  const roundOneLowerBracketMatches = lowerBracketMatches.filter(
    (m) => m.bracketRound === 1
  );
  await prisma.match.update({
    where: {
      id: roundOneLowerBracketMatches[0],
    },
    data: {
      teamOne: seasonTeamIds[6],
      teamTwo: seasonTeamIds[7],
    },
  });
  await prisma.match.update({
    where: { id: roundOneLowerBracketMatches[1] },
    data: {
      teamOne: seasonTeamIds[6],
      teamTwo: seasonTeamIds[7],
    },
  });
}

module.exports = {
  getIdParam,
  parseTeamStats,
  parsePlayerStats,
  seedPlayoffs,
  createTeams,
};
