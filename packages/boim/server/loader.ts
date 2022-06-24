import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import serveStatic from "serve-static";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";
import { renderToErrorPage } from "../pages/templates/htmlTemplate";
import Error from "../pages/_error";

export default function (): Express {
  const app: Express = express();
  const options: serveStatic.ServeStaticOptions<
    express.Response<unknown, Record<string, unknown>>
  > = {
    maxAge: "31557600",
    setHeaders: function (res) {
      res.set("Cache-Control", "public, must-revalidate");
    },
  };
  
  if (process.env.NODE_ENV === "development") {
    console.log("----------------------------------------------------------------");
    console.log("개발 모드 미들웨어 활성화 !!!!!!!");
    console.log("----------------------------------------------------------------");
    
    const webpack = require("webpack");
    const middleware = require("webpack-dev-middleware");
    const devConfig = require("../config/webpack.devServer.config");
    const libConfig = require("../config/webpack.lib.config");
    const hydrationConfig = require("../config/webpack.hydration.config");
    const dynamicConfig = require("../config/webpack.dynamic.config");
    const compiler = webpack([libConfig, hydrationConfig, dynamicConfig, devConfig]);
    const instance = middleware(compiler, {
      serverSideRender: true,
      publicPath: devConfig.output.publicPath,
      hot: true,
      noInfo: true, 
      stats: "minimal",
      historyApiFallback: true
    });

    app.use(instance);
  }

  app.use("/", pageRouter);
  app.use(express.static(`${pathAlias.client}/dist/pages`, options));
  app.use(express.static(`${pathAlias.client}/dist`, options));

  app.use((err, req, res, next) => {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    const errorPage: string = renderToErrorPage(Error, {
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

  return app;
}
