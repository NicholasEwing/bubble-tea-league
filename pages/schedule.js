import React, { useState } from "react";
import Image from "next/image";
import PastMatch from "../components/schedule/PastMatch";
import LiveMatch from "../components/schedule/LiveMatch";
import FutureMatch from "../components/schedule/FutureMatch";
import EventDate from "../components/schedule/EventDate";
import DividerLive from "../components/schedule/DividerLive";
import sequelize from "../sequelize";

// const sequelize = require("../sequelize/index");
// const { Team, Season, Match, MatchRound } = sequelize.models;

export const getStaticProps = async () => {
  const { Match, MatchRound } = sequelize.models;

  const matches = await Match.findAll({ raw: true });
  const matchRounds = await MatchRound.findAll({ raw: true });

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

  const schedule = Object.entries(groupedMatches).map(([key, value]) => {
    return { [key]: value };
  });

  // get matches in this shape
  // const matches = [
  //   {
  //     date: [{ gameInfo: "blah" }, { gameInfo: "blah" }, { gameInfo: "blah" }],
  //     date: [{ gameInfo: "blah" }],
  //     date: [{ gameInfo: "blah" }, { gameInfo: "blah" }],
  //   },
  // ];

  // sort by past -> future
  // for each date, make <EventDate />
  // if date < today, make <PastMatch />
  // if date === today, make <LiveMatch />
  // if date > today, make <FutureMatch />

  return {
    props: {
      schedule: JSON.parse(JSON.stringify(schedule)),
    },
  };
};

export default function Schedule({ schedule }) {
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
                    <PastMatch key={`Past-${match.id}`} MatchId={match.id} />
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
                    <LiveMatch key={`Live-${match.id}`} MatchId={match.id} />
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
                    />
                  ))}
              </React.Fragment>
            );
          } else {
            return (
              <h1 className="text-white text-3xl">
                A match was found with a null / undefined scheduledTime. Please
                yell at nick.
              </h1>
            );
          }
        })
      ) : (
        <h2 className="text-white text-3xl">
          No matches found. Come back later!
        </h2>
      )}
      {/* <EventDate />
      <PastMatch />
      <PastMatch />
      <PastMatch />
      <DividerLive />
      <LiveMatch />
      <LiveMatch />
      <LiveMatch />
      <EventDate weekDay="Tuesday" month="January" date="2" />
      <FutureMatch />
      <FutureMatch />
      <FutureMatch /> */}
    </div>
  );
}
