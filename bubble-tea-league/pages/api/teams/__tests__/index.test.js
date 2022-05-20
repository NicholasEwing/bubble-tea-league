import teamsHandler from "../index";
import { createMocks } from "node-mocks-http";

describe("/api/teams API Endpoint", () => {
  it("should return a successful response", async () => {
    const { req, res } = createMocks();
    await teamsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return an array", async () => {
    const { req, res } = createMocks();
    await teamsHandler(req, res);

    const teams = res._getJSONData();
    expect(teams).toBeArray();

    if (teams.length) {
      it("should contain team objects", () => {
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
    }
  });
});
