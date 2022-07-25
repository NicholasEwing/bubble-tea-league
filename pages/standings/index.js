import Image from "next/image";
import { useState } from "react";
import { Op } from "sequelize";
import PlayoffsBrackets from "../../components/standings/PlayoffsBrackets";
import RegularSeason from "../../components/standings/RegularSeason";
import SeasonItem from "../../components/standings/SeasonItem";
import SeasonSelector from "../../components/standings/SeasonSelector";
import StageSelector from "../../components/standings/StageSelector";

const sequelize = require("../../sequelize/index");
const { Team, Season, Match, MatchRound } = sequelize.models;

export const getStaticProps = async () => {
  let teams = await Team.findAll({ raw: true });
  const seasons = await Season.findAll({ raw: true });

  const groupStageMatches = await Match.findAll({
    where: {
      matchWinnerTeamId: { [Op.not]: null },
      isPlayoffsMatch: false,
    },
    raw: true,
  });

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

  const playoffsMatches = await Match.findAll({
    where: {
      isPlayoffsMatch: true,
    },
    raw: true,
  });

  const playoffsMatchRounds = await MatchRound.findAll({
    where: {
      MatchId: { [Op.in]: playoffsMatches.map((pom) => pom.id) },
    },
    raw: true,
  });

  // add playoffs losses / wins
  teams = teams.map((team) => {
    // return team object WITH new info
    const playoffsWins = playoffsMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const playoffsLosses = playoffsMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
    );
    return { ...team, playoffsWins, playoffsLosses };
  });

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      seasons: JSON.parse(JSON.stringify(seasons)),
      playoffsMatches: JSON.parse(JSON.stringify(playoffsMatches)),
      playoffsMatchRounds: JSON.parse(JSON.stringify(playoffsMatchRounds)),
    },
  };
};

export default function Standings({
  teams,
  seasons,
  playoffsMatches,
  playoffsMatchRounds,
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showPlayoffs, setShowPlayoffs] = useState(false);
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.number || 1);

  // Sort from wins to losses
  const seasonTeams = teams
    .filter((t) => t.season === activeSeason)
    .sort((a, b) => {
      const placeZerosLast = (num) => {
        let x = num;
        return x === 0 ? -Infinity : x;
      };

      const teamAMatchSum = placeZerosLast(
        a.groupStageWins.length - a.groupStageLosses.length
      );
      const teamBMatchSum = placeZerosLast(
        b.groupStageWins.length - b.groupStageLosses.length
      );

      if (teamAMatchSum < teamBMatchSum) {
        return 1;
      } else if (teamBMatchSum < teamAMatchSum) {
        return -1;
      } else {
        return 1;
      }
    });

  const seasonPlayoffsMatches = playoffsMatches.filter(
    (pom) => pom.season === activeSeason
  );

  const seasonPlayoffMatchIds = seasonPlayoffsMatches.map((spom) => spom.id);

  const seasonPlayoffsMatchRounds = playoffsMatchRounds.filter((pomr) =>
    seasonPlayoffMatchIds.includes(pomr.MatchId)
  );

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
        className={`sidebar min-w-[360px] lg:w-[calc(((100%-442px)/12)*3+102px)] bg-[#0a0e13] fixed lg:static z-30 lg:transform-none left-0 top-[calc(54px+80px)] h-full lg:min-h-full w-full ${
          openDropdown ? "translate-x-0" : "-translate-x-full"
        } lg:border-r lg:border-r-[#252c32]`}
      >
        <div className="h-13 border-b border-b-[#252c32] hidden lg:block">
          <SeasonSelector
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
          />
        </div>
        <section className="season-filter h-screen">
          <ul className="seasons min-h-full overflow-x-hidden overflow-y-auto pb-20 lg:h-[calc(100%-75px)] lg:static lg:min-w-[360px] lg:border-r lg:border-r-[#252c32]">
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
      <div className="results w-full mb-12 lg:w-[calc(((100%-360px-340px)/9)*9+340px)] xl:calc(((100%-442px)/12)*9+340px)">
        <div className="StandingsTopNav bg-[#0a0e13]">
          <div className="h-13 border-b border-b-[#252c32] lg:hidden">
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
          <PlayoffsBrackets
            seasonPlayoffsMatches={seasonPlayoffsMatches}
            seasonPlayoffsMatchRounds={seasonPlayoffsMatchRounds}
            seasonTeams={seasonTeams}
          />
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
