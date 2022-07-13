import Image from "next/image";
import { useState } from "react";
import { Op } from "sequelize";
import PlayoffsBrackets from "../../components/standings/PlayoffsBrackets";
import RegularSeason from "../../components/standings/RegularSeason";
import SeasonItem from "../../components/standings/SeasonItem";
import SeasonSelector from "../../components/standings/SeasonSelector";
import StageSelector from "../../components/standings/StageSelector";

const sequelize = require("../../sequelize/index");
const { Team, Season, Match } = sequelize.models;

export const getStaticProps = async () => {
  let teams = await Team.findAll({ raw: true });
  const seasons = await Season.findAll({ raw: true });

  // for testing, delete this later
  seasons.push({ number: 2, tournamentId: 1234, year: 1905 });

  const matches = await Match.findAll({
    where: {
      matchWinnerTeamId: { [Op.not]: null },
      matchLoserTeamId: { [Op.not]: null },
    },
    raw: true,
  });

  teams = teams.map((team) => {
    // return team object WITH new info
    const wins = matches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const losses = matches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
    );
    return { ...team, wins, losses };
  });

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      seasons: JSON.parse(JSON.stringify(seasons)),
    },
  };
};

export default function Standings({ teams, seasons }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showPlayoffs, setShowPlayoffs] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);

  // Sort from wins to losses
  const seasonTeams = teams
    .filter((t) => t.season === activeSeason)
    .sort((a, b) => {
      const placeZerosLast = (num) => {
        let x = num;
        return x === 0 ? -Infinity : x;
      };

      const teamAMatchSum = placeZerosLast(a.wins.length - a.losses.length);
      const teamBMatchSum = placeZerosLast(b.wins.length - b.wins.length);

      if (teamAMatchSum < teamBMatchSum) {
        return 1;
      } else if (teamBMatchSum < teamAMatchSum) {
        return -1;
      } else {
        return 1;
      }
    });

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const toggleSetPlayoffs = (value) => {
    setShowPlayoffs(value);
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
          <StageSelector
            showPlayoffs={showPlayoffs}
            toggleSetPlayoffs={toggleSetPlayoffs}
          />
        </div>
        {showPlayoffs ? (
          <PlayoffsBrackets />
        ) : (
          <RegularSeason
            activeSeason={activeSeason}
            seasonTeams={seasonTeams}
          />
        )}
      </div>
    </div>
  );
}
