import Image from "next/image";
import TeamLogo from "../../components/match-results/TeamHeader/TeamLogo";
import BottomIcon from "../../components/teams/Icons/BottomIcon";
import FillIcon from "../../components/teams/Icons/FillIcon";
import JungleIcon from "../../components/teams/Icons/JungleIcon";
import MiddleIcon from "../../components/teams/Icons/MiddleIcon";
import SupportIcon from "../../components/teams/Icons/SupportIcon";
import TopIcon from "../../components/teams/Icons/TopIcon";
import Name from "../../components/teams/Name";

const sequelize = require("../../sequelize/index");
const { Team, Player } = sequelize.models;

export const getStaticPaths = async () => {
  const teams = await Team.findAll({ raw: true });

  const paths = teams.map((team) => {
    return {
      params: {
        id: team.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;

  const team = await Team.findByPk(id, { raw: true });

  const players = await Player.findAll({
    where: {
      TeamId: id,
    },
    raw: true,
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
      <div className="text-white bg-[#0a0e13] h-36 lg:h-80 p-4 lg:p-8 flex items-end border-b border-b-[#252c32]">
        <div className="block lg:hidden">
          <TeamLogo tricode={team.tricode} width="60" height="60" />
        </div>
        <div className="hidden lg:block">
          <TeamLogo tricode={team.tricode} width="120" height="120" />
        </div>
        <div className="h-12 lg:h-28 flex flex-col ml-4 justify-center">
          <p className="text-xl lg:text-4xl font-medium">
            {team.teamName} - {team.tricode}
          </p>
          <p className="text-md lg:text-2xl text-[#8fa3b0] tracking-tight">
            Season {team.season}
          </p>
        </div>
      </div>
      <div className="roster h-full w-full flex flex-row items-start text-white">
        <div className="info w-full flex flex-wrap bg-[#0a0e13]">
          {players.length ? (
            players.map((player) => (
              <div
                key={player.summonerName}
                className="border-b-[#252c32] border-b lg:border-r-[#252c32] lg:border-r w-full lg:w-1/2 p-4 lg:px-8 h-40 lg:h-64 flex flex-col justify-between"
              >
                {renderRoleIcon(player.role)}
                <Name name={player.summonerName} role={player.role} />
              </div>
            ))
          ) : (
            <h1 className="flex justify-center text-white font-thin text-3xl m-8">
              No players registered for this team yet.
            </h1>
          )}
        </div>
      </div>
    </>
  );
}
