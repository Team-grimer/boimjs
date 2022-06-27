const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");
const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app, _document } = Search.getBaseComponentPath(fileList);

const runner = require("./runner");
const entry =  {
  _www: `${root}/server/_www.ts`
}
const outputOption = {
  filename: "_www.js",
  path: `${client}/dist/server`,
  libraryName: "build-prod"
};
const alias = {
  app: _app,
  document: _document,
};
const mod = false;
const emit = false;
const plugins = [
  new webpack.ContextReplacementPlugin(/express/),
  new MiniCssExtractPlugin(),
  new CleanWebpackPlugin({
    dangerouslyAllowCleanPatternsOutsideProject: true,
    verbose: false,
    dry: false,
    cleanOnceBeforeBuildPatterns: [
      "**/*",
      "../server/**/*",
      "!stats.json",
      "!important.js",
      "!folder/**/*",
    ],
  }),
];

module.exports = runner.createConfig(entry, outputOption, alias, mod, emit, plugins);
