const sequelize = require("../sequelize/index");
const { Team } = sequelize.models;

export const getStaticProps = async () => {
  const teams = await Team.findAll({ raw: true });

  return {
    props: { teams: JSON.parse(JSON.stringify(teams)) },
  };
};

export default function Example({ teams }) {
  return (
    <div className="grid place-items-center">
      <h1>Example</h1>
      {teams.map((team) => (
        <p key={team.id}>{team.teamName}</p>
      ))}
    </div>
  );
}
