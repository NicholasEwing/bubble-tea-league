import teamsHandler from "../index";
import { createMocks } from "node-mocks-http";
import seedTeamsAndPlayers from "../../../../jest/seedTeamsAndPlayers";
import {
  assertStatusResponse,
  fakeInfoGenerator,
  teamSchema,
} from "../../../../lib/jest-api-helpers";

describe("/api/teams", () => {
  beforeAll(async () => {
    try {
      await seedTeamsAndPlayers();
    } catch (error) {
      console.error(
        "Error seeding teams / players in our /api/teams test block:",
        error
      );
    }
  }, 300000);

  it("GET /teams (Get all teams)", async () => {
    try {
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
    } catch (error) {
      console.error("Error getting all teams /api/teams test block:", error);
    }
  });

  it("POST /teams", async () => {
    const fakeTeams = fakeInfoGenerator(teamSchema);
    const { teamName, description, season } = fakeTeams[0];

    const body = {
      teamName,
      description,
      season,
    };

    const { req, res } = createMocks({ method: "POST", body });
    await teamsHandler(req, res);
    assertStatusResponse(res, 201);
  });
});
