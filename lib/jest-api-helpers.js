const { faker } = require("@faker-js/faker");
const mysql2 = require("mysql2/promise");
const { RateLimiter } = require("limiter");
const { getPlayerPUUID } = require("../lib/riot-games-api-helpers");

// Helper function to assert status code and keep things DRY
const assertStatusResponse = (res, codeToAssert) => {
  // this doesn't seem so useful anymore lmao
  expect(res.statusCode).toBe(codeToAssert);
};

// Generate fake data based on faker.js functions in schema objects
const fakeInfoGenerator = (schema, min = 1, max) => {
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
  teamName: "Team {{company.companyName}}",
  description: "{{lorem.sentence(5)}}",
  season: "1",
};

const playerSchema = {
  summonerName: "HughBk", // have to use a real summoner name so we get an actual PUUID
  firstName: "{{name.firstName}}",
  lastName: "{{name.lastName}}",
  discordName: "{{name.firstName}}#{{datatype.number}}",
};

async function replaceFakePlayerInfo(
  matchRoundResults,
  winningPlayers,
  losingPlayers
) {
  const winningPUUIDs = winningPlayers.map((player) => player.PUUID);
  const losingPUUIDs = losingPlayers.map((player) => player.PUUID);
  const newPUUIDs = [...winningPUUIDs, ...losingPUUIDs];

  const winningSummonerNames = winningPlayers.map(
    (player) => player.summonerName
  );
  const losingSummonerNames = losingPlayers.map(
    (player) => player.summonerName
  );
  const newSummonerNames = [...winningSummonerNames, ...losingSummonerNames];

  // Replace metadata player info
  const { participants } = matchRoundResults.metadata;
  participants.splice(0, participants.length, ...newPUUIDs); // replace PUUIDs

  // Replace individual player info
  const infoParticipants = matchRoundResults.info.participants;
  infoParticipants.forEach((player, i) => {
    player.puuid = newPUUIDs[i]; // replace PUUIDs... again
    player.summonerName = newSummonerNames[i]; // replace summonerNames
  });

  return matchRoundResults;
}

module.exports = {
  assertStatusResponse,
  fakeInfoGenerator,
  teamSchema,
  playerSchema,
  replaceFakePlayerInfo,
};
