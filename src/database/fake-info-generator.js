const { faker } = require("@faker-js/faker");

// generator
const generator = (schema, min = 1, max) => {
  max = max || min;
  return Array.from({
    length: faker.datatype.number({
      min,
      max,
    }),
  }).map(() => {
    const innerGen = (anySchema) =>
      Object.keys(anySchema).reduce((entity, key) => {
        if (
          Object.prototype.toString.call(anySchema[key]) === "[object Object]"
        ) {
          entity[key] = innerGen(anySchema[key]);
          return entity;
        }
        entity[key] = faker.fake(anySchema[key]);
        return entity;
      }, {});

    return innerGen(schema);
  });
};

const teamSchema = {
  // id: "{{random.number}}",
  teamName: "Team {{company.companyName}}",
  description: "{{lorem.sentence(5)}}",
};

const playerSchema = {
  // id: "{{random.number}}",
  summonerName: "{{internet.userName}}",
  firstName: "{{name.firstName}}",
  lastName: "{{name.lastName}}",
  discordName: "{{name.firstName}}#{{datatype.number}}",
};

// Generate random data based on schemas above
const fakeTeams = generator(teamSchema, 10);
const fakePlayers = generator(playerSchema, 50);

console.log(
  `Generated ${fakeTeams.length} fake teams and ${fakePlayers.length} fake players.`
);

// loop through all 50 fake players and assign teams to them

// Fake data looks like this:

// Teams:
// [
//  {
//    teamName: 'Team Predovic and Sons',
//    description: 'Quos ut possimus expedita expedita.'
//  },
// {
//   teamName: 'Team Paucek, Mills and Mayert',
//   description: 'Aliquid et ut ratione magni.'
// },
//  ...
// ]

// Players:
// [
//   {
//     summonerName: "Kattie.Treutel",
//     firstName: "Jarod",
//     lastName: "Kuhic",
//     discordName: "Hilda#16153",
//   },
//   {
//     summonerName: 'Rubye_Pollich84',
//     firstName: 'Columbus',
//     lastName: 'Purdy',
//     discordName: 'Zackary#67624'
//   }
//   ...
// ];

module.exports = { fakeTeams, fakePlayers };
