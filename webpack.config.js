const path = require("path");
const fs = require("fs");

module.exports = {
  entry: "./src/lambda.js",
  target: "node",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    // library: 'serverlessExpressEdge',
    libraryTarget: "commonjs2",
  },
  externals: fs.readdirSync("node_modules").filter((x) => {
    return x !== ".bin";
  }),
};
