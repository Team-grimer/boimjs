import dotenv from "dotenv";
import path from "path";
import express from "express";
import pageRouter from "./route";
import { Express } from "express";

dotenv.config();
const app: Express = express();

app.use("/", pageRouter);
app.use(express.static(path.join(__dirname, "../../dist/pages")));

export default function (): Express {
  return app
};
