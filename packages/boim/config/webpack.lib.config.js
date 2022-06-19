const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    directoryApi: `${root}/libs/directoryApi`,
    searchApi: `${root}/libs/searchApi`,
  },
  output: {
    path: `${client}/dist/lib`,
    library: "build-module",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      react: `${client}/node_modules/react`,
      "react-dom": `${client}/node_modules/react-dom`,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: { loader: "ts-loader" },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      root: `${client}`,
      dry: false,
      verbose: true,
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        "!stats.json",
        "!important.js",
        "!folder/**/*",
        `${root}/client/hydratedComponents`,
      ],
    }),
  ],
};
