const config = {
  preset: "ts-jest/presets/js-with-ts",
  verbose: true, //실행 중에 각 개별 테스트를 보고해야 하는지 여부
  rootDir: "test",
  //testEnvironment: "node", //테스트에 사용할 테스트 환경 or jsdom?????
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["./node_modules/"],
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
  testMatch: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx"],
};

module.exports = config;
