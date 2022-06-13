import Sequencer from "@jest/test-sequencer";

export default class CustomSequencer extends Sequencer.default {
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);

    const testOrder = [];

    // sorts tests in this order (index, then [id]):
    // provider [0]
    // seasons [1]
    // teams [2]
    // players [3]
    // matches [4]
    // match-rounds [5]

    copyTests.forEach((test) => {
      const idOrIndexMatches = test.path.match(/__tests__\/(\[id]|index)/m);
      const idOrIndex = idOrIndexMatches[1];

      const apiNameMatches = test.path.match(/api\/([a-zA-Z0-9._-]+)/m);
      const apiName = apiNameMatches[1];

      // No way to predict what order these tests will run
      // so we have to manually set the order of our tests
      switch (true) {
        case apiName === "provider":
          testOrder[0] = test;
          break;
        case apiName === "seasons":
          testOrder[1] = test;
          break;
        case apiName === "teams" && idOrIndex === "index":
          testOrder[2] = test;
          break;
        case apiName === "teams" && idOrIndex === "[id]":
          testOrder[3] = test;
          break;
        case apiName === "players" && idOrIndex === "index":
          testOrder[4] = test;
          break;
        case apiName === "players" && idOrIndex === "[id]":
          testOrder[5] = test;
          break;
        case apiName === "matches" && idOrIndex === "index":
          testOrder[6] = test;
          break;
        case apiName === "matches" && idOrIndex === "[id]":
          testOrder[7] = test;
          break;
        case apiName === "match-rounds" && idOrIndex === "index":
          testOrder[8] = test;
          break;
      }
    });

    return testOrder;
  }
}
