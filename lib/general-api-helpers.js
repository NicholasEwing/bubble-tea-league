// A helper function to assert the request ID param is valid

const { generateTournamentCodes } = require("./riot-games-api-helpers");
const { percentageFormatter } = require("./utils");
const sequelize = require("../sequelize");
const { Match, MatchRound } = sequelize.models;

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
  MatchRoundId
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
    TeamId: winningTeamId,
    MatchRoundId: MatchRoundId,
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
    TeamId: losingTeamId,
    MatchRoundId: MatchRoundId,
  };

  const matchRoundTeamStatsRecords = [
    matchRoundTeamStatsWinner,
    matchRoundTeamStatsLoser,
  ];

  return matchRoundTeamStatsRecords;
}

async function parsePlayerStats(
  allPlayers,
  MatchRoundId,
  matchRoundResults,
  blueTeamId,
  redTeamId,
  matchRoundTeamStatsRecords,
  timelineEvents,
  winningTeamId,
  losingTeamId
) {
  const matchRoundPlayerStatsRecords = allPlayers.map((player, i) => {
    // match PUUID with participant
    const participant = matchRoundResults.info.participants.find(
      (p) => p.puuid === player.PUUID
    );

    // find the player's team
    if (i <= 5) {
      // first 5 players are winners
      const winnerKills = matchRoundTeamStatsRecords.find(
        (team) => team.TeamId === winningTeamId
      ).kills;

      participant.killParticipation = percentageFormatter(
        (participant.kills + participant.assists) / winnerKills
      );
    } else {
      // last 5 players are losers
      const loserKills = matchRoundTeamStatsRecords.find(
        (team) => team.TeamId === winningTeamId
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
      PlayerId: player.id,
      teamSide: player.TeamId === blueTeamId ? "blue" : "red",
      MatchRoundId,
    };

    return matchRoundPlayerStatsObj;
  });

  return matchRoundPlayerStatsRecords;
}

async function createGroupStageMatches(seasonNumber, tournamentId) {
  const matchObjs = Array(100).fill({
    season: seasonNumber,
    isPlayoffsMatch: false,
  });

  const groupStageMatches = await Match.bulkCreate(matchObjs);

  const bestOf = 1;
  const MatchIds = groupStageMatches.map((m) => m.id);

  const tournamentCodes = await generateTournamentCodes(
    bestOf,
    tournamentId,
    MatchIds,
    matchObjs.length
  );

  tournamentCodes.forEach(async (tournamentCode, i) => {
    try {
      const matchRoundObj = {
        MatchId: MatchIds[i],
        tournamentCode,
      };

      await MatchRound.create(matchRoundObj);
    } catch (error) {
      console.error("Error inside tourny code loop:", error);
    }
  });
}

async function createPlayoffsMatches(seasonNumber, tournamentId) {
  const matchObjs = [];
  for (let i = 0; i < 14; i++) {
    matchObjs.push({
      season: seasonNumber,
      isPlayoffsMatch: true,
    });
  }

  // wrote a loop but it was annoying to
  // maintain so I'm just hardcoding 14 objects
  matchObjs[0].isUpperBracket = true;
  matchObjs[1].isUpperBracket = true;
  matchObjs[2].isUpperBracket = true;
  matchObjs[3].isUpperBracket = true;
  matchObjs[4].isUpperBracket = true;
  matchObjs[5].isUpperBracket = true;

  matchObjs[0].bracketRound = 1;
  matchObjs[1].bracketRound = 1;
  matchObjs[2].bracketRound = 2;
  matchObjs[3].bracketRound = 2;
  matchObjs[4].bracketRound = 3;
  matchObjs[5].bracketRound = 4;

  matchObjs[6].isUpperBracket = false;
  matchObjs[7].isUpperBracket = false;
  matchObjs[8].isUpperBracket = false;
  matchObjs[9].isUpperBracket = false;
  matchObjs[10].isUpperBracket = false;
  matchObjs[11].isUpperBracket = false;
  matchObjs[12].isUpperBracket = false;
  matchObjs[13].isUpperBracket = false;

  matchObjs[6].bracketRound = 1;
  matchObjs[7].bracketRound = 1;
  matchObjs[8].bracketRound = 2;
  matchObjs[9].bracketRound = 2;
  matchObjs[10].bracketRound = 3;
  matchObjs[11].bracketRound = 3;
  matchObjs[12].bracketRound = 4;
  matchObjs[13].bracketRound = 5;

  const playoffsMatches = await Match.bulkCreate(matchObjs);

  const bestOf = 3;
  const MatchIds = playoffsMatches.map((m) => m.id);

  const tournamentCodes = await generateTournamentCodes(
    bestOf,
    tournamentId,
    MatchIds,
    matchObjs.length
  );

  let j = 0;
  tournamentCodes.forEach(async (tournamentCode, i) => {
    try {
      const matchRoundObj = {
        MatchId: MatchIds[j],
        tournamentCode,
      };

      if (i % 3 === 0) {
        j++;
      }

      await MatchRound.create(matchRoundObj);
    } catch (error) {
      console.error("Error inside tourny code loop:", error);
    }
  });
}

module.exports = {
  getIdParam,
  parseTeamStats,
  parsePlayerStats,
  createGroupStageMatches,
  createPlayoffsMatches,
};
