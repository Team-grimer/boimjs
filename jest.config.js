const config = {
  preset: "ts-jest/presets/js-with-ts",
  verbose: true,
  rootDir: "test",
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
