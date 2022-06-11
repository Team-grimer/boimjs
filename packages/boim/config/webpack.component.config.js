const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;

const dir = new Directory();
dir.searchDirectory(`${client}/pages`);
const componentEntries = dir.getFilePaths();
dir.writeHydrateComponent(componentEntries);

module.exports = {
  target: "node",
  mode: "production",
  entry: componentEntries,
  output: {
    path: `${client}/dist/components`,
    library: "build-component",
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
  externals: ["react", "react-dom"],
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
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: ["ts-loader"],
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
      dry: true,
      verbose: true,
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [
        "** /*",
        "!static-files*",
        "!directoryToExclude/**",
      ],
      cleanAfterEveryBuildPatterns: ["static*.*", "!static1.js"],
      falserisklyAllowCleanPatternsOutsideProject: true,
    }),
  ],
};
