import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import matchesIdHandler from "../[id]";

describe("/api/matches/[:id]", () => {
  it("PATCH /matches/[:id]", async () => {
    const { req, res } = createMocks({
      method: "PATCH",
      query: { id: 1 },
      body: { id: 1, matchWinnerTeamId: 1 },
    });
    await matchesIdHandler(req, res);
    assertStatusResponse(res, 200);
  });
  it("GET /matches/[:id]", async () => {
    const { req, res } = createMocks({ query: { id: 1 } });
    await matchesIdHandler(req, res);
    const match = res._getJSONData();
    assertStatusResponse(res, 200);
    if (!match) return;
    expect(match).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        season: expect.any(Number),
        matchWinnerTeamId: expect.any(Number),
      })
    );
  });
  // it("DELETE /matches/[:id]", async () => {
  //   const { req, res } = createMocks({
  //     method: "DELETE",
  //     query: { id: 1 },
  //   });
  //   await matchesIdHandler(req, res);
  //   assertStatusResponse(res, 200);
  // });
});
