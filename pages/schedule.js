import React, { useState } from "react";
import Image from "next/image";
import PastMatch from "../components/schedule/PastMatch";
import LiveMatch from "../components/schedule/LiveMatch";
import FutureMatch from "../components/schedule/FutureMatch";
import EventDate from "../components/schedule/EventDate";
import DividerLive from "../components/schedule/DividerLive";
import sequelize from "../sequelize";

export const getStaticProps = async () => {
  const { Match, MatchRound, Team } = sequelize.models;

  const matches = await Match.findAll({ raw: true });
  const matchRounds = await MatchRound.findAll({ raw: true });
  let teams = await Team.findAll({ raw: true });

  const groupStageMatches = matches.filter(
    (m) => m.matchWinnerTeamId && !m.isPlayoffsMatch
  );

  // add group stage losses / wins
  teams = teams.map((team) => {
    // return team object WITH new info
    const groupStageWins = groupStageMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const groupStageLosses = groupStageMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
    );
    return { ...team, groupStageWins, groupStageLosses };
  });

  // thanks stack overflow <3
  const groupByKey = (list, key) =>
    list.reduce(
      (hash, obj) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      }),
      {}
    );

  const groupedMatches = groupByKey(matches, "scheduledTime");

  let schedule = Object.entries(groupedMatches).map(([key, value]) => {
    return { [key]: value };
  });

  // smack matchRound info inside each match object so we can count
  // wins / losses for playoffs matches and get other info we might want later
  schedule = schedule.map((day) => {
    const games = Object.values(day).flat();

    const datesWithMatchRounds = games.map((game) => {
      const matchRoundsForThisGame = matchRounds.filter(
        (mr) => mr.MatchId === game.id
      );
      return { ...game, matchRounds: matchRoundsForThisGame };
    });

    const dateKey = Object.keys(day)[0];

    return { [dateKey]: datesWithMatchRounds };
  });

  return {
    props: {
      schedule: JSON.parse(JSON.stringify(schedule)),
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
};

export default function Schedule({ schedule, teams }) {
  const today = new Date();

  const dateInPast = function (firstDate, secondDate) {
    if (firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }

    return false;
  };

  function isToday(date) {
    const today = new Date();

    if (today.toDateString() === date.toDateString()) {
      return true;
    }

    return false;
  }

  return (
    <div className="text-white min-h-full bg-[#0a0e13]">
      {schedule.length ? (
        schedule.map((dateObj) => {
          const date = new Date(Object.keys(dateObj)[0]);

          if (dateInPast(date, today)) {
            return (
              <React.Fragment key={date}>
                <EventDate date={date} />
                {Object.values(dateObj)
                  .flat()
                  .map((match) => (
                    <PastMatch
                      key={`Past-${match.id}`}
                      MatchId={match.id}
                      teamOne={teams.find((t) => t.id === match.teamOne)}
                      teamTwo={teams.find((t) => t.id === match.teamTwo)}
                      bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                      seasonNumber={match.seasonNumber}
                      matchRounds={match.matchRounds}
                      matchWinnerTeamId={match.matchWinnerTeamId}
                      matchLoserTeamId={match.matchLoserTeamId}
                      scheduledTime={match.scheduledTime}
                    />
                  ))}
              </React.Fragment>
            );
          } else if (isToday(date)) {
            return (
              <React.Fragment key={date}>
                <DividerLive key={date} />
                {Object.values(dateObj)
                  .flat()
                  .map((match) => (
                    <LiveMatch
                      key={`Live-${match.id}`}
                      MatchId={match.id}
                      teamOne={teams.find((t) => t.id === match.teamOne)}
                      teamTwo={teams.find((t) => t.id === match.teamTwo)}
                      bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                      seasonNumber={match.seasonNumber}
                      matchRounds={match.matchRounds}
                      matchWinnerTeamId={match.matchWinnerTeamId}
                      matchLoserTeamId={match.matchLoserTeamId}
                      scheduledTime={match.scheduledTime}
                    />
                  ))}
              </React.Fragment>
            );
          } else if (!dateInPast(date, today)) {
            return (
              <React.Fragment key={date}>
                <EventDate key={date} date={date} />
                {Object.values(dateObj)
                  .flat()
                  .map((match) => (
                    <FutureMatch
                      key={`Future-${match.id}`}
                      MatchId={match.id}
                      teamOne={teams.find((t) => t.id === match.teamOne)}
                      teamTwo={teams.find((t) => t.id === match.teamTwo)}
                      bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                      seasonNumber={match.seasonNumber}
                      matchRounds={match.matchRounds}
                      scheduledTime={match.scheduledTime}
                    />
                  ))}
              </React.Fragment>
            );
          } else {
            return (
              <h1 className="text-white text-xl">
                A <code>dateObj</code> was found with a null / undefined / non
                Date Object key. Please yell at Nick to fix this.
              </h1>
            );
          }
        })
      ) : (
        <h2 className="text-white text-3xl">
          No matches found. Come back later!
        </h2>
      )}
    </div>
  );
}
