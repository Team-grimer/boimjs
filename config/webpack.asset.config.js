const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();
dir.searchDirectory(`${client}/public`);
const assetEntries = dir.getAssetFiles();

const runner = require("./runner");
const outputOption = {
  filename: "",
  path: `${client}/dist/public`,
  libraryName: "build-asset"
};
const alias = false;
const mod = {
  rules: [
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: "asset/resource",
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      },
    },
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    },
    {
      test: /\.(txt)$/i,
      type: "asset/source",
    },
  ],
};
const emit = false;
const plugins = [
  new CleanWebpackPlugin({
    dangerouslyAllowCleanPatternsOutsideProject: true,
    dry: false,
    verbose: false,
    cleanOnceBeforeBuildPatterns: [
      "**/*",
      "../public/**/*",
      "../pages/**/*",
      "../manifest.json",
      "../dynamicManifest.json",
      "!stats.json",
      "!important.js",
      "!folder/**/*",
    ],
  }),
];

module.exports = runner.createConfig(assetEntries, outputOption, alias, mod, emit, plugins);
