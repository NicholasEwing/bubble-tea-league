import matchesHandler from "../index";
import { createMocks } from "node-mocks-http";
import {
  assertStatusResponse,
  fakeInfoGenerator,
  playerSchema,
} from "../../../../lib/jest-api-helpers";

describe("/api/matches", () => {
  it("POST /matches (Create a couple Best of 3 matches)", async () => {
    const season = 1;
    const bestOf = 3;

    const body = {
      season,
      bestOf, // use this to generate X number of tourny codes via Riot Games API
    };

    // we'll use this one for testing match-rounds later
    const { req, res } = createMocks({ method: "POST", body });
    await matchesHandler(req, res);
    assertStatusResponse(res, 201);

    // we'll use this to test our DELETE /matches/[id] route later
    const deleteEvents = createMocks({ method: "POST", body });
    const delReq = deleteEvents.req;
    const delRes = deleteEvents.res;
    await matchesHandler(delReq, delRes);
    assertStatusResponse(delRes, 201);
  });

  it("GET /matches (Get all matches)", async () => {
    const { req, res } = createMocks();
    await matchesHandler(req, res);
    const matches = res._getJSONData();

    assertStatusResponse(res, 200);
    expect(matches).toBeArray();

    if (!matches.length) return;

    expect(matches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          season: expect.any(Number),
        }),
      ])
    );
  });
});
