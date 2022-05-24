import providerHandler from "../index";
import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";

describe("/api/provider", () => {
  it("POST /provider", async () => {
    const { req, res } = createMocks();
    await providerHandler(req, res);
    const provider = res._getJSONData();

    if (provider.length) {
      // if provider is made AND reset is FALSE, expect 409
      const failEvents = createMocks({ method: "POST" });
      const failReq = failEvents.req;
      const failRes = failEvents.res;
      await providerHandler(failReq, failRes);
      assertStatusResponse(failRes, 409);

      // if provider is made AND reset is TRUE, expect 201 after creating one
      const events = createMocks({ method: "POST", body: { reset: true } });
      const resetReq = events.req;
      const resetRes = events.res;
      await providerHandler(resetReq, resetRes);
      assertStatusResponse(resetRes, 201);
    } else if (!provider.length) {
      // if no providers, POST should return 201 after creating one
      const createEvents = createMocks({ method: "POST" });
      const createReq = createEvents.req;
      const createRes = createEvents.res;
      await providerHandler(createReq, createRes);
      assertStatusResponse(createRes, 201);
    }
  });

  it("GET /provider", async () => {
    const { req, res } = createMocks();
    await providerHandler(req, res);
    const provider = res._getJSONData();

    assertStatusResponse(res, 200);
    expect(provider).toBeArray();

    if (!provider.length) return;

    expect(provider).toBeArrayOfSize(1);

    expect(provider).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          providerId: expect.any(Number),
        }),
      ])
    );
  });
});
