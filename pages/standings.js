import Image from "next/image";
import { useEffect, useState } from "react";
import { Op } from "sequelize";
import PlayoffsBrackets from "../components/standings/PlayoffsBrackets";
import RegularSeason from "../components/standings/RegularSeason";
import SeasonItem from "../components/standings/SeasonItem";
import SeasonSelector from "../components/standings/SeasonSelector";
import StageSelector from "../components/standings/StageSelector";
import { sortStandings } from "../lib/utils";

export const getStaticProps = async () => {
  const sequelize = require("../sequelize/index");
  const { Team, Season, Match, MatchRound } = sequelize.models;

  let teams = await Team.findAll({ raw: true });
  const seasons = await Season.findAll({ raw: true });

  const groupStageMatches = await Match.findAll({
    where: {
      isPlayoffsMatch: false,
    },
    raw: true,
  });

  const groupStageMatchRounds = await MatchRound.findAll({
    where: {
      MatchId: { [Op.in]: groupStageMatches.map((m) => m.id) },
    },
    raw: true,
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

  // add group stage losses / wins
  teams = teams.map((team) => {
    // return team object WITH new info
    const groupStageWins = groupStageMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const groupStageLosses = groupStageMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
    );

    const playoffsWins = playoffsMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const playoffsLosses = playoffsMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
    );
    return {
      ...team,
      groupStageWins,
      groupStageLosses,
      playoffsWins,
      playoffsLosses,
    };
  });

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      seasons: JSON.parse(JSON.stringify(seasons)),
      groupStageMatches: JSON.parse(JSON.stringify(groupStageMatches)),
      groupStageMatchRounds: JSON.parse(JSON.stringify(groupStageMatchRounds)),
      playoffsMatches: JSON.parse(JSON.stringify(playoffsMatches)),
      playoffsMatchRounds: JSON.parse(JSON.stringify(playoffsMatchRounds)),
    },
  };
};

export default function Standings({
  teams,
  seasons,
  groupStageMatches,
  groupStageMatchRounds,
  playoffsMatches,
  playoffsMatchRounds,
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showPlayoffs, setShowPlayoffs] = useState(false);
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.number || 1);
  const [seasonTeams, setSeasonTeams] = useState([]);

  useEffect(() => {
    let seasonTeams = teams.filter((t) => t.season === activeSeason);

    seasonTeams = sortStandings(
      seasonTeams,
      groupStageMatches,
      groupStageMatchRounds
    );

    setSeasonTeams(seasonTeams);
  }, [activeSeason, teams, groupStageMatches, groupStageMatchRounds]);

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
    <div className="Standings relative flex min-h-full overflow-hidden bg-[#0f1519] text-white">
      <div
        className={`sidebar fixed left-0 top-[calc(54px+80px)] z-30 h-full w-full min-w-[360px] bg-[#0a0e13] lg:static lg:min-h-full lg:w-[calc(((100%-442px)/12)*3+102px)] lg:transform-none ${
          openDropdown ? "translate-x-0" : "-translate-x-full"
        } lg:border-r lg:border-r-[#252c32]`}
      >
        <div className="h-13 hidden border-b border-b-[#252c32] lg:block">
          <SeasonSelector
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
          />
        </div>
        <section className="season-filter h-screen">
          <ul className="seasons min-h-full overflow-y-auto overflow-x-hidden pb-20 lg:static lg:h-[calc(100%-75px)] lg:min-w-[360px] lg:border-r lg:border-r-[#252c32]">
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
      <div className="results xl:calc(((100%-442px)/12)*9+340px) mb-12 w-full lg:w-[calc(((100%-360px-340px)/9)*9+340px)]">
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
