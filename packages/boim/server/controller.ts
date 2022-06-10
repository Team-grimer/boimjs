import path from "path";
import fs from "fs";
import { getHTML } from "../pages/templates/htmlTemplate";
import { Request, Response, NextFunction } from "express";
import { ReactElement } from "react";
import Directory from "../libs/directoryApi";

export default function handleGetPage(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void {
  if (req.url.endsWith("/favicon.ico")) {
    return res.end();
  }
  if (req.url.endsWith(".js")) {
    return next();
  }

  const url: string = req.url.endsWith("/") ? req.url : req.url + "/";
  const page: ReactElement = require(`../../../../dist/components${url + "index.js"}`).default;
  const htmlFile: string = path.resolve(`../../../dist/pages${url + "index.html"}`);
  const data: string = fs.readFileSync(htmlFile, "utf-8");
  const app: string = getHTML(page, [url + "index.js"]);


  if (data.length !== app.length) {
    const dir = new Directory();
    dir.clearWriteSync(htmlFile);
    dir.updateWriteSync(htmlFile, app);
  }

  return res.send(app);
}
