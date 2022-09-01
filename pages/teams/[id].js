import Image from "next/image";
import { Op } from "sequelize";
import TeamLogo from "../../components/match-results/TeamHeader/TeamLogo";
import BottomIcon from "../../components/teams/Icons/BottomIcon";
import FillIcon from "../../components/teams/Icons/FillIcon";
import JungleIcon from "../../components/teams/Icons/JungleIcon";
import MiddleIcon from "../../components/teams/Icons/MiddleIcon";
import OpGGButton from "../../components/teams/Icons/OpGGIcon";
import SupportIcon from "../../components/teams/Icons/SupportIcon";
import TopIcon from "../../components/teams/Icons/TopIcon";
import Name from "../../components/teams/Name";

const sequelize = require("../../sequelize/index");
const { Team, Player, PlayerTeamHistory } = sequelize.models;

export const getStaticPaths = async () => {
  const teams = await Team?.findAll({ raw: true });

  // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
  if (!teams) {
    return {
      notFound: true,
    };
  }

  const paths = teams.map((team) => {
    return {
      params: {
        id: team.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;

  const team = await Team.findByPk(id, { raw: true });

  const playerHistories = await PlayerTeamHistory.findAll({
    where: {
      TeamId: id,
    },
    attributes: ["PlayerId", "role"],
    raw: true,
  });

  const playerIds = playerHistories.map((ph) => ph.PlayerId);

  let players = await Player.findAll({
    where: {
      id: {
        [Op.in]: playerIds,
      },
    },
    raw: true,
  });

  players = players.map((player) => {
    const playerHistory = playerHistories.find((h) => h.PlayerId === player.id);
    const playerRole = playerHistory.role;

    return { ...player, role: playerRole };
  });
  // find all players and send to page componnent as prop

  return {
    props: {
      team: JSON.parse(JSON.stringify(team)),
      players: JSON.parse(JSON.stringify(players)),
    }, // will be passed to the page component as props
  };
};

export default function TeamPage({ team, players }) {
  function renderRoleIcon(role) {
    switch (role) {
      case "Jungle":
        return <JungleIcon />;
      case "Top":
        return <TopIcon />;
      case "Middle":
        return <MiddleIcon />;
      case "Bottom":
        return <BottomIcon />;
      case "Support":
        return <SupportIcon />;
      case "Fill":
        return <FillIcon />;
      default:
        return <p>Icon not found. Go yell at Nick!</p>;
    }
  }

  return (
    <>
      <div className="border-b border-b-[#252c32] bg-[#0a0e13] p-4 text-white lg:h-64 lg:p-8">
        <section className="flex h-full flex-1 flex-col items-start space-y-4 md:flex-row lg:items-end">
          <div className="flex flex-1 items-start justify-center space-x-4 md:items-center md:justify-start">
            <div>
              <TeamLogo tricode={team.tricode} width="100" height="100" />
            </div>
            <span>
              <p className="text-xl font-medium lg:text-4xl">
                {team.teamName} - {team.tricode}
              </p>
              <p className="text-md tracking-tight text-[#8fa3b0] lg:text-2xl">
                Season {team.season}
              </p>
            </span>
          </div>
          <OpGGButton players={players} />
        </section>
      </div>
      <div className="roster flex h-full w-full flex-row items-start text-white">
        <div className="info flex w-full flex-wrap bg-[#0a0e13]">
          {players.length ? (
            players.map((player) => (
              <div
                key={player.summonerName}
                className=" flex w-full space-x-8 border-b border-b-[#252c32] p-4 md:h-32 lg:h-64 lg:w-1/2 lg:border-r lg:border-r-[#252c32] lg:p-8 lg:px-8"
              >
                {renderRoleIcon(player.role)}
                <Name name={player.summonerName} role={player.role} />
              </div>
            ))
          ) : (
            <h1 className="m-8 flex justify-center text-3xl font-thin text-white">
              No players registered for this team yet.
            </h1>
          )}
        </div>
      </div>
    </>
  );
}
