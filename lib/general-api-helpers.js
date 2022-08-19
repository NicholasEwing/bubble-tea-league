const { generateTournamentCodes } = require("./riot-games-api-helpers");
const { percentageFormatter, sortStandings } = require("./utils");
const sequelize = require("../sequelize");
import { Op } from "sequelize";

const { teamSchema, fakeInfoGenerator } = require("./jest-api-helpers");
const { Match, MatchRound, Team, PlayerTeamHistory, TeamStanding } =
  sequelize.models;

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
  losingTeamId,
  season
) {
  const seasonTeams = await Team.findAll({
    where: {
      season,
    },
    attributes: ["id"],
    raw: true,
  });

  const seasonTeamIds = seasonTeams.map((st) => st.id);

  const playerIds = allPlayers.map((p) => p.id);

  const seasonPlayerHistories = await PlayerTeamHistory.findAll({
    where: {
      PlayerId: {
        [Op.in]: playerIds,
      },
      TeamId: {
        [Op.in]: seasonTeamIds,
      },
    },
    raw: true,
  });

  try {
    const matchRoundPlayerStatsRecords = allPlayers.map((player, i) => {
      // match PUUID with participant
      const participant = matchRoundResults.info.participants.find(
        (p) => p.puuid === player.PUUID
      );

      const { TeamId: playerTeamId } = seasonPlayerHistories.find(
        (history) => history.PlayerId === player.id
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
        teamSide: playerTeamId === blueTeamId ? "blue" : "red",
        MatchRoundId,
      };

      return matchRoundPlayerStatsObj;
    });

    return matchRoundPlayerStatsRecords;
  } catch (error) {
    console.log("Error parsing player stats.");
    console.error(error);
  }
}

async function createGroupStageMatches(seasonNumber, tournamentId) {
  try {
    // admin can change these team names and add players later
    // we just need them for group stage logic
    let placeholderTeams = fakeInfoGenerator(teamSchema, 10);
    placeholderTeams = placeholderTeams.map((t) => ({
      ...t,
      tricode: t.tricode.toUpperCase(),
      season: seasonNumber,
    }));
    placeholderTeams = await Team.bulkCreate(placeholderTeams);

    // place teams into Team Standings page
    const teamStandingRecords = placeholderTeams.map((team, i) => {
      return { TeamId: team.id, placement: i + 1 };
    });
    await TeamStanding.bulkCreate(teamStandingRecords);

    let scheduledTime = new Date(new Date().getFullYear() + 1, 0, 1); // set to Jan 1st of next year
    const matchObjs = placeholderTeams.reduce((matchObjs, team) => {
      // each team should have 9 matches against all other teams
      // for a total of 45 Match objects

      const allMatchesForTeam = placeholderTeams.map((comparedTeam) => {
        const comparingSameTeam = team.id === comparedTeam.id;

        const matchupAlreadyExists = matchObjs.some((match) => {
          return (
            (match.teamOne === team.id && match.teamTwo === comparedTeam.id) ||
            (match.teamOne === comparedTeam.id && match.teamTwo === team.id)
          );
        });

        if (comparingSameTeam || matchupAlreadyExists) return null;

        return {
          season: seasonNumber,
          isPlayoffsMatch: false,
          teamOne: team.id,
          teamTwo: comparedTeam.id,
          scheduledTime: new Date(
            scheduledTime.setDate(scheduledTime.getDate() + 1) // add one day
          ),
        };
      });

      return [...matchObjs, ...allMatchesForTeam.filter((m) => m)];
    }, []);

    const groupStageMatches = await Match.bulkCreate(matchObjs);

    const bestOf = 1;
    const MatchIds = groupStageMatches.map((m) => m.id);

    const tournamentCodes = await generateTournamentCodes(
      bestOf,
      tournamentId,
      MatchIds,
      matchObjs.length
    );

    const matchRoundObjs = tournamentCodes.map((tournamentCode, i) => {
      // 50% chance to assign a team to red / blue
      const { teamOne, teamTwo, id: MatchId } = groupStageMatches[i];

      const redTeamId = Math.random() < 0.5 ? teamOne : teamTwo;

      const blueTeamId = redTeamId === teamOne ? teamTwo : teamOne; // whichever team was NOT picked for the red team;

      return {
        MatchId,
        tournamentCode,
        redTeamId,
        blueTeamId,
      };
    });

    const groupStageMatchRounds = await MatchRound.bulkCreate(matchRoundObjs);

    return [groupStageMatches, groupStageMatchRounds];
  } catch (error) {
    console.error(error);
  }
}

async function createPlayoffsMatches(seasonNumber, tournamentId) {
  const matchObjs = [];
  for (let i = 0; i < 14; i++) {
    matchObjs.push({
      season: seasonNumber,
      isPlayoffsMatch: true,
    });
  }

  let scheduledTime = new Date(new Date().getFullYear() + 1, 0, 46); // set to Jan 1st of next year + 46 days

  // wrote a loop but it was annoying to
  // maintain so I'm just hardcoding 14 objects, sue me ¯\_(ツ)_/¯
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

  for (const obj of matchObjs) {
    obj.scheduledTime = scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

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
  const matchRoundObjs = tournamentCodes.map((tournamentCode, i) => {
    const iPlusOne = i + 1;

    const obj = {
      MatchId: MatchIds[j],
      tournamentCode,
    };

    if (i > 0 && iPlusOne % 3 === 0) {
      j++;
    }

    return obj;
  });

  const playoffsMatchRounds = await MatchRound.bulkCreate(matchRoundObjs);

  return [playoffsMatches, playoffsMatchRounds];
}

async function seedPlayoffs(season, seasonTeams) {
  const seasonTeamIds = seasonTeams.map((t) => t.id);

  const seasonalPlayoffsMatches = await Match.findAll({
    where: {
      season,
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
  roundTwoUpperBracketMatches[0].update({
    matchWinnerTeamId: seasonTeamIds[0],
    teamOne: seasonTeamIds[0],
  });
  roundTwoUpperBracketMatches[1].update({
    matchWinnerTeamId: seasonTeamIds[1],
    teamOne: seasonTeamIds[1],
  });

  // 3 - 6 go into Upper Bracket Round 1
  const roundOneUpperBracketMatches = upperBracketMatches.filter(
    (m) => m.bracketRound === 1
  );
  roundOneUpperBracketMatches[0].update({
    teamOne: seasonTeamIds[2],
    teamTwo: seasonTeamIds[3],
  });
  roundOneUpperBracketMatches[1].update({
    teamOne: seasonTeamIds[4],
    teamTwo: seasonTeamIds[5],
  });

  // 7 - 10 go into Lower Bracket Round 1
  const roundOneLowerBracketMatches = lowerBracketMatches.filter(
    (m) => m.bracketRound === 1
  );
  roundOneLowerBracketMatches[0].update({
    teamOne: seasonTeamIds[6],
    teamTwo: seasonTeamIds[7],
  });
  roundOneLowerBracketMatches[1].update({
    teamOne: seasonTeamIds[8],
    teamTwo: seasonTeamIds[9],
  });
}

module.exports = {
  getIdParam,
  parseTeamStats,
  parsePlayerStats,
  createGroupStageMatches,
  createPlayoffsMatches,
  seedPlayoffs,
};
