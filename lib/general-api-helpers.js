// A helper function to assert the request ID param is valid
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
    TeamId: losingTeamId,
    MatchRoundId: MatchRoundId,
  };

  const matchRoundTeamStatsRecords = [
    matchRoundTeamStatsWinner,
    matchRoundTeamStatsLoser,
  ];

  return matchRoundTeamStatsRecords;
}

async function parsePlayerStats(allPlayers, MatchRoundId, matchRoundResults) {
  const matchRoundPlayerStatsRecords = allPlayers.map((player) => {
    // match PUUID with participant
    const participant = matchRoundResults.info.participants.find(
      (p) => p.puuid === player.PUUID
    );

    const primaryRuneInfo = participant.perks.styles.find(
      (s) => s.description === "primaryStyle"
    );
    const secondaryRuneInfo = participant.perks.styles.find(
      (s) => s.description === "subStyle"
    );

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
      PlayerId: player.id,
      MatchRoundId,
    };

    return matchRoundPlayerStatsObj;
  });

  return matchRoundPlayerStatsRecords;
}

export { getIdParam, parseTeamStats, parsePlayerStats };
