const path = require("path");

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");
const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app, _document } = Search.getBaseComponentPath(fileList);

const isDevelopment = process.env.NODE_ENV === "development";
console.log("isDevelopment <devServer>", isDevelopment);

module.exports = {
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  devServer: {
    open: true,
    static: {
      directory: `${client}/dist/pages`,
      publicPath: "/"
    },
    compress: true,
    port: 7777,
    hot: "only",
  },
  target: "node",
  mode: "development",
  entry: `${root}/server/_www.ts`,
  output: {
    filename: "_www.js",
    path: `${client}/dist/server`,
    publicPath: "http://localhost:7777/pages",
    assetModuleFilename: "../public/[contenthash][ext]",
    library: "build-devServer",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      react: `${client}/node_modules/react`,
      "react-dom": `${client}/node_modules/react-dom`,
      app: _app,
      document: _document,
    },
  },
  optimization: {
    minimize: false,
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
        test: /\.(less|scss|module.css)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader?exportOnlyLocals",
            options: {
              modules: true,              
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
          "less-loader",
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
        ],
      },
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
    new webpack.ContextReplacementPlugin(/express/),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      verbose: true,
      dry: false,
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        "!stats.json",
        "!important.js",
        "!folder/**/*",
      ],
    }),
  ],
};
