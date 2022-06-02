import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import playersIdHandler from "../[id]";
const { faker } = require("@faker-js/faker");

describe("/api/players/[:id]", () => {
  it("GET /players/[:id]", async () => {
    const { req, res } = createMocks({ body: { id: 1 } });
    await playersIdHandler(req, res);
    const player = res._getJSONData();

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

  it("PATCH /players/[:id]", async () => {
    const firstName = faker.name.firstName();

    const { req, res } = createMocks({
      method: "PATCH",
      params: { id: 1 },
      body: { id: 1, firstName },
    });
    await playersIdHandler(req, res);

    assertStatusResponse(res, 200);
  });

  it("DELETE /players/[:id]", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
      params: { id: 1 },
    });
    await playersIdHandler(req, res);

    assertStatusResponse(res, 200);
  });
});
