import playersHandler from "../index";
import { createMocks } from "node-mocks-http";
import {
  assertStatusResponse,
  fakeInfoGenerator,
  playerSchema,
} from "../../../../lib/jest-api-helpers";

describe("/api/players", () => {
  it("GET /players (Get all players)", async () => {
    const { req, res } = createMocks();
    await playersHandler(req, res);
    const players = res._getJSONData();

    assertStatusResponse(res, 200);
    expect(players).toBeArray();

    if (!players.length) return;

    expect(players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          PUUID: expect.any(String),
          summonerName: expect.any(String),
          discordName: expect.any(String),
          isSubstitute: expect.any(Boolean),
        }),
      ])
    );
  });

  it("POST /players (Create a random player)", async () => {
    const fakePlayer = fakeInfoGenerator(playerSchema);
    const { firstName, lastName, discordName, summonerName } = fakePlayer[0];

    const body = {
      firstName,
      lastName,
      discordName,
      summonerName: "HughBk", // this has to be a real summoner name since PUUID is required
    };

    const { req, res } = createMocks({ method: "POST", body });
    await playersHandler(req, res);
    assertStatusResponse(res, 201);
  });
});
