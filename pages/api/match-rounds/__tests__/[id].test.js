import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import matchRoundIdHandler from "../[id]";

describe("/api/match-rounds/[:id]", () => {
  it("GET /match-rounds/[:id]", async () => {
    const { req, res } = createMocks({ query: { id: 1 } });
    await matchRoundIdHandler(req, res);
    const matchRound = res._getJSONData();

    assertStatusResponse(res, 200);

    if (!matchRound) return;

    expect(matchRound).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        gameId: expect.any(String),
        tournamentcode: expect.any(String),
        metaData: expect.any(String),
        MatchId: expect.any(Number),
        winningTeamId: expect.any(Number),
        losingTeamId: expect.any(Number),
      })
    );
  });
});
