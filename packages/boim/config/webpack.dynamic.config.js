const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();

dir.searchDirectory(`${root}/client/dynamicComponents`);
const hydratedDynamicComponentEntries = dir.getFilePaths();

const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app } = Search.getBaseComponentPath(fileList);

const isDevelopment = process.env.NODE_ENV === "development";
console.log("isDevelopment <dynamic>", isDevelopment);

module.exports = {
  target: "node",
  mode: isDevelopment ? "development" : "production",
  entry: hydratedDynamicComponentEntries,
  output: {
    path: `${client}/dist/pages`,
    filename: "[name][chunkhash].js",
    library: "build-dynamic",
    libraryTarget: "umd",
    globalObject: "this",
    assetModuleFilename: "../public/[contenthash][ext]",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      react: `${client}/node_modules/react`,
      "react-dom": `${client}/node_modules/react-dom`,
      app: _app,
    },
  },
  optimization: {
    minimize: isDevelopment ? false : true,
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
        use:  isDevelopment ? [
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
        ] : [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              emit: true,
            },
          },
          {
            loader: "css-loader",
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
        ],
      },
      {
        test: /\.css$/,
        use: isDevelopment ? [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader?exportOnlyLocals",
            options: {
              modules: false,
            },
          },
        ] : [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              emit: true,
            },
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
    new HtmlWebpackPlugin({
      inject: true,
      filename: ".[name].html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name][contenthash].css",
    }),
    new WebpackManifestPlugin({
      fileName: "../dynamicManifest.json",
    }),
  ],
};
