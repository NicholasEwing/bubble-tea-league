const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);
    // console.log("TEST:", copyTests);

    const testOrder = new Array(6);

    // sorts tests in this order:
    // provider [0]
    // seasons [1]
    // teams [2]
    // players [3]
    // matches [4]
    // match-rounds [5]

    copyTests.forEach((test) => {
      const idOrIndexMatches = test.path.match(/__tests__\/(\[id]|index)/m);
      const idOrIndex = idOrIndexMatches[1];

      const apiNameMatches = test.path.match(/api\/(\w+)/m);
      const apiName = apiNameMatches[1];

      // provider [0]
      // seasons [1]
      // teams, index [2]
      // teams, id [3]
      // players, index [4]
      // players, id [5]
      // matches, index [6]
      // matches, id [7]
      // match-rounds, index ???
      // match-rounds, id ???

      // No way to predict what other these tests loop
      // so we manually organize the order of our tests
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
      }
    });

    return testOrder;
  }
}

module.exports = CustomSequencer;
