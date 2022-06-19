import dotenv from "dotenv";
import express, { Express } from "express";
import serveStatic from "serve-static";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";

dotenv.config();

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

  app.use("/", pageRouter);
  app.use(express.static(`${pathAlias.client}/dist/pages`, options));
  app.use(express.static(`${pathAlias.client}/dist`, options));

  return app;
}
