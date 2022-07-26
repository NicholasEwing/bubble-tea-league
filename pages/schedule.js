import { useState } from "react";
import Image from "next/image";
import PastMatch from "../components/schedule/PastMatch";
import LiveMatch from "../components/schedule/LiveMatch";
import FutureMatch from "../components/schedule/FutureMatch";
import EventDate from "../components/schedule/EventDate";
import DividerLive from "../components/schedule/DividerLive";

// const sequelize = require("../sequelize/index");
// const { Team, Season, Match, MatchRound } = sequelize.models;

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default function Schedule({}) {
  return (
    <div className="text-white">
      <EventDate />
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
      <FutureMatch />
    </div>
  );
}
