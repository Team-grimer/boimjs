import dotenv from "dotenv";
import express, { Express } from "express";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";

dotenv.config();

export default function (): Express {
  const app: Express = express();

  app.use("/", pageRouter);
  app.use(express.static(`${pathAlias.client}/dist/pages`));

  return app;
}
