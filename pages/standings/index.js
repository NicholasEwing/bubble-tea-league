import Image from "next/image";
import { useState } from "react";
import SeasonItem from "../../components/standings/SeasonItem";
import SeasonSelector from "../../components/standings/SeasonSelector";
import StageSelector from "../../components/standings/StageSelector";

import StandingItem from "../../components/standings/StandingItem";

const sequelize = require("../../sequelize/index");
const { Team, Season } = sequelize.models;

export const getStaticProps = async () => {
  const teams = await Team.findAll({ raw: true });
  const seasons = await Season.findAll({ raw: true });

  // for testing, delete this later
  seasons.push({ number: 2, tournamentId: 1234, year: 1905 });

  // calculate team wins and attach to team object

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      seasons: JSON.parse(JSON.stringify(seasons)),
    },
  };
};

export default function Standings({ teams, seasons }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleActiveSeason = (number) => {
    setActiveSeason(number);
  };

  return (
    <div className="Standings flex relative overflow-hidden min-h-full bg-[#0f1519] text-white">
      <div
        className={`sidebar min-h-full min-w-[360px] bg-[#0a0e13] fixed z-30 left-0 top-[calc(54px+80px)] h-full w-full ${
          openDropdown ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <section className="season-filter">
          <h2 className="title hidden uppercase">SEASONS</h2>
          <ul className="seasons h-full overflow-x-hidden overflow-y-auto pb-20">
            {seasons &&
              seasons.map((season) => (
                <SeasonItem
                  key={`season-item-${season.number}`}
                  season={season}
                  handleActiveSeason={handleActiveSeason}
                  isActive={activeSeason === season.number}
                />
              ))}
          </ul>
        </section>
      </div>
      <div className="results w-full mb-12">
        <div className="StandingsTopNav bg-[#0a0e13]">
          <div className="h-13 border-b border-b-[#252c32]">
            <SeasonSelector
              openDropdown={openDropdown}
              handleDropdown={handleDropdown}
            />
          </div>
          <StageSelector />
        </div>
        <div className="max-w-full">
          <div className="title m-4 font-medium text-xl">Standings</div>
          {/* for each team, display a standing item */}
          {/* calculate ordinal inline or something idk */}
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
          <StandingItem team="Deep Dive" ordinal={1} wins={4} losses={2} />
        </div>
      </div>
    </div>
  );
}
