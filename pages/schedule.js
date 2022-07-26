import { useState } from "react";
import Image from "next/image";
import PastMatch from "../components/schedule/PastMatch";
import LiveMatch from "../components/schedule/LiveMatch";

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
      <PastMatch />
      <LiveMatch />
      {/* <FutureMatch /> */}
    </div>
  );
}
