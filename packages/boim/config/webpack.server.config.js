const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");
const Search = require(`${client}/dist/lib/searchApi`).default;
const fileList = Search.getFileList(`${client}/pages`);
const { _app, _document } = Search.getBaseComponentPath(fileList);

const isDevelopment = process.env.NODE_ENV === "development";
console.log("isDevelopment", isDevelopment);

module.exports = {
  target: "node",
  mode: isDevelopment ? "development" : "production",
  devServer: isDevelopment
    ? {
      allowedHosts: "auto",
      bonjour: {
        type: "http",
        protocol: "udp",
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
          reconnect: 5,
        },
      },
      compress: true,
      devMiddleware: {
        index: true,
        mimeTypes: { phtml: "text/html" },
        publicPath: "/publicPathForDevServe",
        serverSideRender: true,
        writeToDisk: true,
      },
      http2: true,
      historyApiFallback: true,
      host: "0.0.0.0",
      hot: "only",
      liveReload: false,
      magicHtml: true,
      open: true,
      port: 7777,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          bypass: function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
              console.log("Skipping proxy for browser request.");
              return "/index.html";
            }
          },
        },
      },
      static: {
        directoryPath: [`${client}/dist`],
        staticOptions: {
          redirect: true,
        },
      }
    }
    : undefined,
  entry: `${root}/server/_www.ts`,
  output: {
    filename: "_www.js",
    path: `${client}/dist/server`,
    assetModuleFilename: "../public/[contenthash][ext]",
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
              emit: false,
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
            loader: "css-loader?exportOnlyLocals",
            options: {
              modules: false,
            },
          },
        ] : [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              emit: false,
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
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      root: `${client}`,
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
