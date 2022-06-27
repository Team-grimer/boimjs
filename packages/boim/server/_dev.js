// @ts-nocheck
require("dotenv").config();

const express = require("express");
const webpack = require("webpack");
const mdw = require("webpack-dev-middleware");

const Error = require("../../../dist/dev/_error").default;
const htmlTemplate = require("../../../dist/dev/htmlTemplate");
const pageRouter = require("../../../dist/dev/pageRouter").default;
const pathAlias = require("../../../dist/dev/pathAlias").default;

const app = express();

const hydrationConfig = require(`${pathAlias.root}/config/webpack.hydration.config.js`);
const dynamicConfig = require(`${pathAlias.root}/config/webpack.dynamic.config.js`);

const hydrationCompiler = webpack({
  ...hydrationConfig, 
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
    followSymlinks: true,
    stdin: true,
  },
});
const dynamicCompiler = webpack({
  ...dynamicConfig, 
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
    followSymlinks: true,
    stdin: true,
  },
});

const hydrationMiddleware = mdw(hydrationCompiler, {
  publicPath: `${pathAlias.client}/dist/pages`,
  writeToDisk: true,
  serverSideRender: true,
  stats: false
});
const dynamicMiddleware = mdw(dynamicCompiler, {
  publicPath: `${pathAlias.client}/dist/pages`,
  writeToDisk: true,
  serverSideRender: true,
  stats: false
});

app.use("/", pageRouter);
app.use(hydrationMiddleware);
app.use(dynamicMiddleware);
app.use(express.static(`${pathAlias.client}/dist/pages`));
app.use(express.static(`${pathAlias.client}/dist`));

app.use((err, req, res, next) => {
  res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const errorPage = htmlTemplate.renderToErrorPage(Error, {
    renderProps: {
      props: {
        title: err.message,
        statusCode: res.statusCode,
      },
    },
  });

  console.warn(err.message);
  res.send(errorPage);

  return;
});

const port = process.env.PORT || 6263;

app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
