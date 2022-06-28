const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const root = path.resolve("./");
const client = path.resolve(root, "../../");
const isDev = process.env.NODE_ENV === "development";

function createConfig(entries, outputOption, additionalAlias, mod, emit, plugins) {
  return {
    target: "node",
    mode: isDev ? "development" : "production",
    entry: { ...entries },
    output: {
      filename: outputOption.filename ? outputOption.filename : "[name]",
      path: outputOption.path,
      library: outputOption.libraryName,
      libraryTarget: "umd",
      globalObject: "this",
      assetModuleFilename: "../public/[name][ext]",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      alias: {
        react: `${client}/node_modules/react`,
        "react-dom": `${client}/node_modules/react-dom`,
        ...additionalAlias,
      }
    },
    devtool: isDev ? "eval-source-map": false,
    optimization: {
      minimize: isDev ? false : true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            sourceMap: isDev ? true : false,
          }
        }),
      ],
    },
    module: mod ? { ...mod } : {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: { loader: "ts-loader" },
        },
        {
          test: /\.jsx?$/,
          exclude: emit ? /\\/ : /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                "env": {
                  "development" : {
                    "compact": false
                  }
                }
              },
            },
          ],
        },
        {
          test: /\.(less|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
            "less-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
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
    plugins: [...plugins],
  };
}

module.exports = { createConfig };
