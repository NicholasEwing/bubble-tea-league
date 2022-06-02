import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import playersIdHandler from "../[id]";

describe("/api/players/[:id]", () => {
  let req, res, player;

  const body = {
    id: 1,
  };

  beforeAll(async () => {
    ({ req, res } = createMocks({ body }));
    await playersIdHandler(req, res);
    player = res._getJSONData();
  });

  it("GET /players/[:id]", async () => {
    assertStatusResponse(res, 200);

    if (!player) return;

    expect(player).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        PUUID: expect.any(String),
        summonerName: expect.any(String),
        discordName: expect.any(String),
        isSubstitute: expect.any(Number),
      })
    );
  });
});
