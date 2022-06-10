const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const Directory = require("../../../dist/libs/directoryApi").default;

const dir = new Directory();
dir.searchDirectory("../../../pages");
const componentEntries = dir.getFilePaths();
dir.writeHydrateComponent(componentEntries);

module.exports = {
  target: "node",
  mode: "production",
  entry: componentEntries,
  output: {
    path: path.resolve("../../../dist/components"),
    library: "build-component",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      react: path.resolve("../../../node_modules/react"),
      "react-dom": path.resolve("../../../node_modules/react-dom"),
    },
  },
  externals: ["react", "react-dom"],
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
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: ["ts-loader"],
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
  plugins: [
    new CleanWebpackPlugin({
      // 파일 제거 시뮬레이션 
      // 
      // 기본값: false 
      dry: true,

      // 콘솔에 로그 쓰기 
      // (dry가 true일 때 항상 활성화됨) 
      // 
      // 기본값: false 
      verbose: true,

      // 재빌드 시 사용하지 않는 모든 웹팩 자산을 자동으로 제거합니다 . 
      // 
      // 기본값: true 
      cleanStaleWebpackAssets: false,

      // 현재 웹팩 자산의 제거를 허용하지 않음 
      // 
      // 기본값: true 
      protectWebpackAssets: false,

      // **경고** 
      // 
      // 아래 옵션에 대한 참고 사항: 
      // 
      // 그것들은 안전하지 않습니다...따라서 처음에는 dry: true로 테스트합니다. 
      // 
      // 웹팩의 output.path 디렉토리에 상대적입니다. 
      // webpack의 output.path 디렉토리 외부인 경우 
      // 전체 경로를 사용합니다. path.join(process.cwd(), 'build/**/*') 
      // 
      // 이 옵션은 del의 패턴 매칭 API를 확장합니다. 
      // 패턴 매칭 문서는 https://github.com/sindresorhus/del#patterns 참조 //


      // Webpack 컴파일 전에 파일을 한 번 제거합니다 . 
      // 재빌드에 포함되지 않음(감시 모드) 
      // 
      // !negative 패턴을 사용하여 파일 제외 
      // 
      // 기본값: ['**/*'] 
      cleanOnceBeforeBuildPatterns: [
        '** /*',
        '!static-files*',
        '!directoryToExclude/**',
      ],
      cleanOnceBeforeBuildPatterns: [],  // cleanOnceBeforeBuildPatterns 비활성화

      // 이 패턴과 일치하는 모든 빌드(감시 모드 포함) 후에 파일을 제거합니다. 
      // Webpack에서 직접 생성하지 않은 파일에 사용합니다. 
      // 
      // !negative 패턴을 사용하여 파일 제외 
      // 
      // 기본값: [] 
      cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],

      // process.cwd() 외부의 깨끗한 패턴 허용 
      // 
      // dry 옵션을 명시적으로 설정해야 함 
      // 
      // 기본값: 
      falserisklyAllowCleanPatternsOutsideProject: true,
    }),
  ],
};
