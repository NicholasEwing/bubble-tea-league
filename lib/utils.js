function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " K"
    : Math.sign(num) * Math.abs(num);
}

function percentageFormatter(number) {
  return Math.floor((Math.round(number * 100) / 100) * 100);
}

function varAsString(varObj) {
  Object.keys(varObj)[0];
}

function isEqual(value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  var otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function (item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
}

const findTeamName = (teamId, teams) => {
  if (parseInt(teamId) && teams.length) {
    const { teamName } = teams.find((team) => team.id == teamId);
    return teamName;
  } else {
    return "-";
  }
};

// this is used for seeding playoffs and showing teams on the /standings page to
// ensure they're always in the same order
function sortStandings(seasonTeams, groupStageMatches, groupStageMatchRounds) {
  // takes array of 10 teams with groupStageWins / groupStageLosses attached
  const sortedTeams = seasonTeams.sort((a, b) => {
    const teamATotalGames = a.groupStageWins.length + a.groupStageLosses.length;
    const teamBTotalGames = b.groupStageWins.length + b.groupStageLosses.length;

    // sort logic so far:
    // 1) if unequal # of games, sort by most wins, fewest losses, and most games.
    // 2) if equal, sort by match sum (wins - losses), then head-to-head, then
    // strength of victory (?), then fastest avg win duration
    if (
      teamATotalGames &&
      teamBTotalGames &&
      teamATotalGames !== teamBTotalGames
    ) {
      const teamATotalWins = a.groupStageWins.length;
      const teamBTotalWins = b.groupStageWins.length;
      const teamATotalLosses = a.groupStageLosses.length;
      const teamBTotalLosses = b.groupStageLosses.length;

      // sort by most wins, then least losses, then most games
      if (teamATotalWins > teamBTotalWins) {
        return -1;
      } else if (teamATotalWins < teamBTotalWins) {
        return 1;
      } else if (teamATotalLosses < teamBTotalLosses) {
        return -1;
      } else if (teamATotalLosses > teamBTotalLosses) {
        return 1;
      } else if (teamATotalGames > teamBTotalGames) {
        return -1;
      } else if (teamATotalGames < teamBTotalGames) {
        return 1;
      }
    } else if (teamATotalGames === teamBTotalGames) {
      let teamAMatchSum;
      if (teamATotalGames) {
        teamAMatchSum = a.groupStageWins.length - a.groupStageLosses.length;
      } else {
        teamAMatchSum = -Infinity;
      }

      let teamBMatchSum;
      if (teamBTotalGames) {
        teamBMatchSum = b.groupStageWins.length - b.groupStageLosses.length;
      } else {
        teamBMatchSum = -Infinity;
      }

      if (teamAMatchSum > teamBMatchSum) {
        return -1;
      } else if (teamAMatchSum < teamBMatchSum) {
        return 1;
      } else if (teamAMatchSum === teamBMatchSum) {
        // run tiebreaker calculations now...

        // TODO: add head-to-head tiebreaker calculations

        // TODO: avg win game duration tiebreaker (DONE)
        const teamAMatchIdsWins = groupStageMatches
          .filter((m) => m.matchWinnerTeamId === a.id)
          .map((m) => m.id);
        const teamBMatchIdsWins = groupStageMatches
          .filter((m) => m.matchWinnerTeamId === b.id)
          .map((m) => m.id);

        const teamAMatchRoundWins = groupStageMatchRounds.filter(
          (mr) => mr.winningTeamId === a.id
        );
        const teamBMatchRoundWins = groupStageMatchRounds.filter(
          (mr) => mr.winningTeamId === b.id
        );

        const teamATotalDuration = teamAMatchRoundWins.reduce(
          (duration, m) => (duration += m.gameDuration),
          0
        );
        const teamBTotalDuration = teamBMatchRoundWins.reduce(
          (duration, m) => (duration += m.gameDuration),
          0
        );

        const teamAWinsGameDurationAvg =
          teamATotalDuration / teamAMatchRoundWins.length;
        const teamBWinsGameDurationAvg =
          teamBTotalDuration / teamBMatchRoundWins.length;

        if (teamAWinsGameDurationAvg < teamBWinsGameDurationAvg) {
          return -1;
        } else if (teamAWinsGameDurationAvg > teamBWinsGameDurationAvg) {
          return 1;
        } else {
          // in the incredibly unlucky event both teams have the same
          // win game duration average, flip a coin
          const coinFlip = Math.random() < 0.5 ? 1 : -1;
          return coinFlip;
        }
      }
    } else {
      return 0;
    }
  });

  return sortedTeams;
}

export {
  kFormatter,
  percentageFormatter,
  varAsString,
  isEqual,
  findTeamName,
  sortStandings,
};
