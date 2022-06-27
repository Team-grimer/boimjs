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
const devEntries = {
  _error: `${root}/pages/_error.tsx`,
  htmlTemplate: `${root}/pages/templates/htmlTemplate.tsx`,
  pageRouter: `${root}/server/route.ts`,
  pathAlias: `${root}/libs/pathAlias.ts`
};
const outputOption = {
  filename: "[name].js",
  path: `${client}/dist/dev`,
  libraryName: "build-dev"
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
      "../dev/**/*",
      "!stats.json",
      "!important.js",
      "!folder/**/*",
    ],
  }),
];

module.exports = runner.createConfig(devEntries, outputOption, alias, mod, emit, plugins);
