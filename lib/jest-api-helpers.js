const { faker } = require("@faker-js/faker");
const { RateLimiter } = require("limiter");

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
        entity[key] = faker.helpers.fake(anySchema[key]);
        return entity;
      }, {});

    return innerGen(schema);
  });
};

const teamSchema = {
  teamName: "Team {{company.name}}",
  description: "{{lorem.sentence(5)}}",
  tricode: "{{random.alpha(3)}}",
};

const playerSchema = {
  summonerName: "HughBk", // have to use a real summoner name so we get an actual PUUID
  firstName: "{{name.firstName}}",
  lastName: "{{name.lastName}}",
  discordName: "{{name.firstName}}#{{datatype.number}}",
};

function replaceTimelinePUUIDs(timelineEvents, newPUUIDs) {
  timelineEvents.metadata.participants.splice(
    0,
    timelineEvents.metadata.participants.length,
    ...newPUUIDs
  );

  timelineEvents.info.participants.forEach((player, i) => {
    player.puuid = newPUUIDs[i]; // replace PUUIDs... again
  });

  return timelineEvents;
}

async function replaceFakePlayerInfo(
  matchRoundResults,
  timelineEvents,
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

  // replace match v5 info
  matchRoundResults.metadata.participants.splice(
    0,
    matchRoundResults.metadata.participants.length,
    ...newPUUIDs
  ); // replace PUUIDs

  matchRoundResults.info.participants.forEach((player, i) => {
    player.puuid = newPUUIDs[i]; // replace PUUIDs... again
    player.summonerName = newSummonerNames[i]; // replace summonerNames
  });

  // replace timeline events info
  replaceTimelinePUUIDs(timelineEvents, newPUUIDs);

  return [matchRoundResults, timelineEvents];
}

module.exports = {
  assertStatusResponse,
  fakeInfoGenerator,
  teamSchema,
  playerSchema,
  replaceFakePlayerInfo,
  replaceTimelinePUUIDs,
};
