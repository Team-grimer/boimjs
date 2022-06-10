import path from "path";

import dotenv from "dotenv";
import express, { Express } from "express";

import pageRouter from "./route";

dotenv.config();
const app: Express = express();

app.use("/", pageRouter);
app.use(express.static(path.join(__dirname, "../../dist/pages")));

export default function (): Express {
  return app;
}
