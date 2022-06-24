const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();

dir.searchDirectory(`${client}/public`);
const assetEntries = dir.getAssetFiles();

const isDevelopment = process.env.NODE_ENV === "development";
console.log("isDevelopment <asset>", isDevelopment);

module.exports = {
  target: "node",
  mode: isDevelopment ? "development" : "production",
  entry: assetEntries,
  output: {
    path: `${client}/dist/public`,
    library: "build-asset",
    libraryTarget: "umd",
    globalObject: "this",
    assetModuleFilename: "../public/[name][ext]",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".png", ".jpg", ".jpeg", ".gif", ".txt"],
    alias: {
      react: `${client}/node_modules/react`,
      "react-dom": `${client}/node_modules/react-dom`,
    },
  },
  optimization: {
    minimize: isDevelopment ? false : true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
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
  },
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false,
      verbose: true,
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        "../public/**/*",
        "!stats.json",
        "!important.js",
        "!folder/**/*",
        `${root}/client/**/*`,
      ],
    }),
  ],
};
