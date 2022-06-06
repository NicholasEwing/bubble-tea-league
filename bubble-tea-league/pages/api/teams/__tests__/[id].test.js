import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import teamsIdHandler from "../[id]";
const { faker } = require("@faker-js/faker");

describe("/api/teams/[:id]", () => {
  it("GET /teams/[:id]", async () => {
    const { req, res } = createMocks({ body: { id: 1 } });
    await teamsIdHandler(req, res);
    const team = res._getJSONData();
    assertStatusResponse(res, 200);

    if (!team) return;

    expect(team).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        teamName: expect.any(String),
        description: expect.any(String),
        season: expect.any(Number),
      })
    );
  });

  it("PATCH /teams/[:id]", async () => {
    const teamName = faker.company.companyName();

    const { req, res } = createMocks({
      method: "PATCH",
      params: { id: 11 },
      body: { id: 11, teamName },
    });
    await teamsIdHandler(req, res);

    assertStatusResponse(res, 200);
  });

  it("DELETE /teams/[:id]", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
      params: { id: 11 },
    });
    await teamsIdHandler(req, res);

    assertStatusResponse(res, 200);
  });
});
