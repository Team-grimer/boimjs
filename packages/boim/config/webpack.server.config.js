const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const serverConfig = {
  target: "node",
  mode: "production",
  entry: `${root}/server/_www.ts`,
  output: {
    filename: "_www.js",
    path: `${client}/dist/server`,
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
              // eslint-disable-next-line prettier/prettier
              presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
            },
          },
        ],
      },
    ],
  },
};

module.exports = serverConfig;
