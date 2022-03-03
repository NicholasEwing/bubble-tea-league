const { generateTeamPages } = require("./generators/teamPages");

async function generatePagesFromDB(sequelize) {
  try {
    const { models } = sequelize;

    generateTeamPages(models);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { generatePagesFromDB };
