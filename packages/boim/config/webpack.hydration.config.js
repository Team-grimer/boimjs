const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;

const dir = new Directory();
dir.searchDirectory(`${root}/client/hydratedComponents`);
const hydratedComponentEntries = dir.getFilePaths();

module.exports = {
  target: "node",
  mode: "production",
  entry: hydratedComponentEntries,
  output: {
    path: `${client}/dist/pages`,
    library: "build-page",
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
              presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: (entryName) => `.${entryName}.html`,
    }),
  ],
};
