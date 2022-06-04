const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;

const commonConfig = require("./webpack.common");

const clientConfig = {
  entry: {
    index: "../../../pages/index.js",
    home: "../../../pages/Home.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("../../../dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: (entryName) => entryName + ".html",
      // chunks : ['multiple'],
    }),
    new InjectBodyPlugin({
      content: '<div id="__boim"></div>',
    }),
  ],
};

module.exports = { ...clientConfig, ...commonConfig };
