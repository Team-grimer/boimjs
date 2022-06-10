const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

const serverConfig = {
  target: "node",
  mode: "production",
  entry: "./server/_www.ts",
  output: {
    filename: "_www.js",
    path: path.resolve("../../../dist/server"),
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

module.exports = serverConfig;
