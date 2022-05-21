import providerHandler from "../index";
import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";

describe("/api/provider", () => {
  let req, res, provider;

  beforeAll(async () => {
    ({ req, res } = createMocks());
    await providerHandler(req, res);
    provider = res._getJSONData();
  });

  it("GET /provider", () => {
    assertStatusResponse(res, 200);
    expect(provider).toBeArray();

    if (!provider.length) return;

    expect(provider).toEqual(expect.arrayContaining([expect.any(Number)]));
  });

  it("POST /provider", async () => {
    if (provider.length) {
      // if provider is made AND reset is FALSE, expect 409
      const { req, res } = createMocks({ method: "POST" });
      await providerHandler(req, res);
      assertStatusResponse(res, 409);

      // if provider is made AND reset is TRUE, expect 201
      const { resetReq, resetRes } = createMocks({
        method: "POST",
        body: { reset: true },
      });
      await providerHandler(resetReq, resetRes);
      assertStatusResponse(resetRes, 201);
    } else if (!provider.length) {
      // if no providers, POST should return 201
      const { req, res } = createMocks({ method: "POST" });
      await providerHandler(req, res);
      assertStatusResponse(res, 201);
    }
  });
});
