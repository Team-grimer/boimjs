module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" },  
      "useBuiltIns" : "usage",
      "corejs" : {"version": 3, "proposals": true }
    }],
    "@babel/preset-react",
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
};
