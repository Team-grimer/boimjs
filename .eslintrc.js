module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "eslint-config-prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  rules: {
    "prettier/prettier": "error",
    indent: ["warn", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    "no-var": "error",
    "no-unused-vars": "warn",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling"]],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
