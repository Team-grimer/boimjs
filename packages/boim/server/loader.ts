import dotenv from "dotenv";
import express, { Express } from "express";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";

dotenv.config();

export default function (): Express {
  const app: Express = express();
  const options = {
    maxAge: "31557600",
    setHeaders: function (res) {
      res.set("Cache-Control", "public, must-revalidate");
    },
  };

  app.use("/", pageRouter);
  app.use(express.static(`${pathAlias.client}/dist/pages`, options));

  return app;
}
