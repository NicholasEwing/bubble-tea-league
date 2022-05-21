import { createMocks } from "node-mocks-http";
import teamsIdHandler from "../[id]";

describe("/api/teams/[:id] API Endpoint", () => {
  let req, res, team;

  // look for a team with an id of 1 in the db
  const body = {
    id: 1,
  };

  beforeAll(async () => {
    ({ req, res } = createMocks({ body }));
    await teamsIdHandler(req, res);
    team = res._getJSONData();
  });

  it("should return a successful response", () => {
    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a single team object", async () => {
    expect(team).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        teamName: expect.any(String),
        description: expect.any(String),
        season: expect.any(Number),
      })
    );
  });
});
