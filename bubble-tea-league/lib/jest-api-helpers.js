const { faker } = require("@faker-js/faker");
const mysql2 = require("mysql2/promise");

// Helper function to assert status code and keep things DRY
const assertStatusResponse = (res, codeToAssert) => {
  expect(res.statusCode).toBe(codeToAssert);
  if (codeToAssert === 200) {
    expect(res.getHeaders()).toEqual({
      "content-type": "application/json",
    });
  }
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
};

const playerSchema = {
  summonerName: "HughBk", // have to use a real summoner name so we get an actual PUUID
  firstName: "{{name.firstName}}",
  lastName: "{{name.lastName}}",
  discordName: "{{name.firstName}}#{{datatype.number}}",
};

module.exports = {
  assertStatusResponse,
  fakeInfoGenerator,
  teamSchema,
  playerSchema,
};
