const path = require("path");

const commonConfig = require("./webpack.common");

const serverConfig = {
  target: "node",
  entry: "./server/index.js",
  output: {
    filename: "server.js",
    path: path.resolve("../../../dist"),
  },
};

module.exports = { ...serverConfig, ...commonConfig }
