const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TimeFixPlugin = require("time-fix-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();
dir.searchDirectory(`${client}/pages`);
const componentEntries = dir.getFilePaths();
const dynamicPaths = dir.getDynamicPaths(`${client}/pages`);
dir.writeHydrateComponent(componentEntries, dynamicPaths);
dir.writeDynamicHydrateComponent(dynamicPaths);
dir.searchDirectory(`${root}/client/hydratedComponents`);
const hydratedComponentEntries = dir.getFilePaths();

const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app } = Search.getBaseComponentPath(fileList);

const runner = require("./runner");
const isDevelopment = process.env.NODE_ENV === "development";
const outputOption = {
  filename: isDevelopment ? "[name].js" : "[name][contenthash].js",
  path: `${client}/dist/pages`,
  libraryName: "build-page"
};
const alias = {
  app: _app,
};
const mod = false;
const emit = true;
const plugins = [
  new TimeFixPlugin(),
  new HtmlWebpackPlugin({
    inject: false,
    filename: ".[name].html",
  }),
  new MiniCssExtractPlugin({
    filename: isDevelopment ? "[name].css" : "[name][contenthash:8].css",
  }),
  new WebpackManifestPlugin({
    fileName: "../manifest.json",
  }),
  new CleanWebpackPlugin({
    dangerouslyAllowCleanPatternsOutsideProject: true,
    verbose: false,
    dry: false,
    cleanOnceBeforeBuildPatterns: [
      "!stats.json",
      "!important.js",
      "!folder/**/*",
    ],
  }),
];

module.exports = runner.createConfig(hydratedComponentEntries, outputOption, alias, mod, emit, plugins);
