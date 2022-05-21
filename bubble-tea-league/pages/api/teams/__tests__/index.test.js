import teamsHandler from "../index";
import { createMocks } from "node-mocks-http";

describe("/api/teams", () => {
  let req, res, teams;

  beforeAll(async () => {
    ({ req, res } = createMocks());
    await teamsHandler(req, res);
    teams = res._getJSONData();
  });

  // it("should return a successful response", () => {
  //   expect.assertions();

  //   expect(res.statusCode).toBe(200);
  //   expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
  //   expect(res.statusMessage).toEqual("OK");
  // });

  // it("All Teams, GET /teams", () => {
  //   expect.assertions();
  //   expect(teams).toBeArray();
  // });

  it("GET /teams", () => {
    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      "content-type": "application/json",
    });
    expect(res.statusMessage).toEqual("OK");
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
});
