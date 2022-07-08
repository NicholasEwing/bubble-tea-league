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

  console.log("players", players);

  // find all players and send to page componnent as prop

  return {
    props: {
      team: JSON.parse(JSON.stringify(team)),
      players: JSON.parse(JSON.stringify(players)),
    }, // will be passed to the page component as props
  };
};

export default function TeamPage({ team, players }) {
  return (
    <div>
      <h1>team: {team.teamName}</h1>
      <h1>desc: {team.description}</h1>
      <h1>tricode: {team.tricode}</h1>
      {players.length ? (
        players.map((player) => (
          <div key={player.summonerName}>
            <h1>{player.summonerName}</h1>
            <h1>{player.discordName}</h1>
            <h1>{player.role}</h1>
          </div>
        ))
      ) : (
        <h1>No players found</h1>
      )}
    </div>
  );
}
