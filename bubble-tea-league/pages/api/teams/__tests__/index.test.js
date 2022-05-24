import teamsHandler from "../index";
import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";

describe("/api/teams", () => {
  it("GET /teams (Get all teams)", async () => {
    const { req, res } = createMocks();
    await teamsHandler(req, res);
    const teams = res._getJSONData();

    assertStatusResponse(res, 200);
    expect(teams).toBeArray();

    if (!teams.length) return;

    expect(teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          teamName: expect.any(String),
          description: expect.any(String),
          season: expect.any(Number),
        }),
      ])
    );
  });

  it("POST /teams", async () => {
    const body = {
      teamName: "Panic In Our Oceans",
      description: "Wow what a cool team",
      season: 1,
    };

    const { req, res } = createMocks({ method: "POST", body });
    await teamsHandler(req, res);
    // expect an id or other status code that shows it was created
    assertStatusResponse(res, 201);
  });
});
