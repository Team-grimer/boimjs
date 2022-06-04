const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "../pages/index.js",
    home: "../pages/Home.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("../dist"),
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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: (entryName) => entryName + ".html",
    }),
    new InjectBodyPlugin({
      content: '<div id="__boim"></div>',
    }),
  ],
};
