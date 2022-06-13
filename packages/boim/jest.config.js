const config = {
  preset: "ts-jest/presets/js-with-ts",
  verbose: true,
  rootDir: "./",
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
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jest-environment-node",
  globalTeardown: "./config/test-teardown-globals.js",
};

module.exports = config;
