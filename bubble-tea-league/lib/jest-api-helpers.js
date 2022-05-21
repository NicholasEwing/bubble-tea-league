const assertStatusResponse = (res, codeToAssert) => {
  expect(res.statusCode).toBe(codeToAssert);
  if (codeToAssert === 200) {
    expect(res.getHeaders()).toEqual({
      "content-type": "application/json",
    });
  }
  expect(res.statusMessage).toEqual("OK");
};

module.exports = { assertStatusResponse };
