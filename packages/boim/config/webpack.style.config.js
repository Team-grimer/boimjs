const path = require("path");
const fs = require("fs");

const TerserPlugin = require("terser-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

const root = path.resolve("./");
const client = path.resolve(root, "../../../");

const Directory = require(`${client}/dist/lib/directoryApi`).default;
const dir = new Directory();

dir.searchDirectory(`${client}/styles`);
const cssEntries = dir.getCssFiles();

const groups = {};
Object.keys(cssEntries).forEach((key) => {
  groups[`${key}Styles`] = {
    type: "css/mini-extract",
    name: `${key}`,
    chunks: (chunk) => chunk.name === `${key}`,
    enforce: true,
  };
});

const styleConfig = {
  target: "node",
  mode: "production",
  entry: cssEntries,
  output: {
    path: `${client}/dist/styles`,
    library: "build-page",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".css", ".scss", ".sass", ".less"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: groups,
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
      (compiler) => {
        const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
        new CssMinimizerPlugin({
          minimizerOptions: {
            map: {
              inline: false,
              annotation: false,
            },
          },
        }).apply(compiler);
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.(less|scss|css|)$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
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
    ],
  },
  plugins: [
    new ExtractCssChunks({
      filename: "[name][contenthash].css",
    }),
    new WebpackManifestPlugin({
      fileName: "../styleManifest.json",
    }),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          () => {
            dir.searchDirectory(`${client}/dist/styles`);

            const files = dir.getFilePaths();

            Object.values(files).forEach((filePath) => {
              fs.unlinkSync(filePath);
            });
          },
        ],
      },
    }),
  ],
};

module.exports = styleConfig;
