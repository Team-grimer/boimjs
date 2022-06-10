const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    directoryApi: path.resolve("./libs/directoryApi"),
  },
  output: {
    path: path.resolve("../../../dist/libs"),
    library: "build-module",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      react: path.resolve("../../../node_modules/react"),
      "react-dom": path.resolve("../../../node_modules/react-dom"),
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
};
