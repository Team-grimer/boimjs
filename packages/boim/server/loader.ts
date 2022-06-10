import dotenv from "dotenv";
import express, { Express } from "express";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";

dotenv.config();
const app: Express = express();

app.use("/", pageRouter);
app.use(express.static(`${pathAlias.client}/dist/pages`));

export default function (): Express {
  return app;
}
