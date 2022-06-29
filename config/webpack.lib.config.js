const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");

const runner = require("./runner");
const entries = {
  directoryApi: `${root}/libs/directoryApi`,
  searchApi: `${root}/libs/searchApi`,
};
const outputOption = {
  filename: "",
  path: `${client}/dist/lib`,
  libraryName: "build-lib"
};
const alias = undefined;
const mod = undefined;
const emit = false;

const plugins = [
  new MiniCssExtractPlugin(),
  new CleanWebpackPlugin({
    dangerouslyAllowCleanPatternsOutsideProject: true,
    dry: false,
    verbose: false,
    cleanOnceBeforeBuildPatterns: [
      "**/*",
      "../lib/**/*",
      "!stats.json",
      "!important.js",
      "!folder/**/*",
      `${root}/client/**/*`,
    ],
  }),
];

module.exports = runner.createConfig(entries, outputOption, alias, mod, emit, plugins);
