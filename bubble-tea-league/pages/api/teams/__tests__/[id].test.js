import { createMocks } from "node-mocks-http";
import teamsHandler from "../[id]";

describe("/api/teams/[:id] API Endpoint", () => {
  it("should return a successful response", async () => {
    const { req, res } = createMocks({ body: { id: 1 } });
    await teamsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a single team objects", async () => {
    const { req, res } = createMocks({ body: { id: 1 } });
    await teamsHandler(req, res);

    const team = res._getJSONData();
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
