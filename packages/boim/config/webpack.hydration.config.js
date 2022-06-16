const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();

dir.searchDirectory(`${client}/pages`);
const componentEntries = dir.getFilePaths();
dir.writeHydrateComponent(componentEntries);

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
    assetModuleFilename: "../public/[contenthash][ext]",
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
      {
        test: /\.(less|scss|css|)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              emit: true,
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      {
        test: /\.(txt)$/i,
        type: "asset/source",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: (entryName) => `.${entryName}.html`,
    }),
    new MiniCssExtractPlugin({
      filename: "../pages[name].css",
    }),
  ],
};
