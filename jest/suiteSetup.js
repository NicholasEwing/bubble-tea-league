import sequelize from "../sequelize/";
// after all Jest tests, close Sequelize connections
// otherwise, our tests will hang for a bit
afterAll(() => sequelize.close());

// add all jest-extended matchers
import * as matchers from "jest-extended";
expect.extend(matchers.default);
