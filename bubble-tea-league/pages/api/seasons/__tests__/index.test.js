import seasonsHandler from "../index";
import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
const sequelize = require("../../../../sequelize");
const { Season } = sequelize.models;

describe("/api/seasons", () => {
  let req, res, season;

  beforeAll(async () => {
    ({ req, res } = createMocks());
    await seasonsHandler(req, res);
    season = res._getJSONData();
  });

  it("GET /seasons (Get all seasons)", async () => {
    assertStatusResponse(res, 200);
    expect(season).toBeArray();

    if (!season.length) return;

    expect(season).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          number: expect.any(Number),
          tournamentId: expect.any(Number),
        }),
      ])
    );
  });

  it("POST /seasons (Create a BTL season)", async () => {
    expect(season).toBeArray();
    const body = {
      name: "BTL Test Tournament!",
    };

    if (season.length) return; // if we have a season, skip test

    const events = createMocks({ method: "POST", body });
    const postReq = events.req;
    const postRes = events.res;
    await seasonsHandler(postReq, postRes);

    assertStatusResponse(201);
  });
});
