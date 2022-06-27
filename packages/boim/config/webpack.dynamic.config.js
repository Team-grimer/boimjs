const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();
dir.searchDirectory(`${root}/client/dynamicComponents`);
const hydratedDynamicComponentEntries = dir.getFilePaths();

const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app } = Search.getBaseComponentPath(fileList);

const runner = require("./commonConfig");
const isDevelopment = process.env.NODE_ENV === "development";
const outputOption = {
  filename: isDevelopment ? "[name].js" : "[name][contenthash].js",
  path: `${client}/dist/pages`,
  libraryName: "build-dynamic"
};
const alias = {
  app: _app,
};
const mod = false;
const emit = true;
const plugins = [
  new HtmlWebpackPlugin({
    inject: false,
    filename: ".[name].html",
  }),
  new MiniCssExtractPlugin({
    filename: isDevelopment ? "[name].css" : "[name][contenthash:8].css",
  }),
  new WebpackManifestPlugin({
    fileName: "../dynamicManifest.json",
  }),
];

module.exports = runner.createConfig(hydratedDynamicComponentEntries, outputOption, alias, mod, emit, plugins);
