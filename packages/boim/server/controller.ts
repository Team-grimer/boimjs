import path from "path";
import fs from "fs";

import { ReactElement } from "react";

import { Request, Response, NextFunction } from "express";

import { getHTML } from "../pages/templates/htmlTemplate";
import Directory from "../libs/directoryApi";
import pathAlias from "../libs/pathAlias";
import Fetch from "../libs/fetchApi";

interface Client {
  default: ReactElement;
  SSG?: object;
  SSR?: object;
}

interface Data {
  renderType: string;
  renderProps: object;
}

export default async function handleGetPage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<unknown, Record<string, unknown>> | void> {
  if (req.url.endsWith("/favicon.ico")) {
    return res.end();
  }

  if (req.url.endsWith(".js")) {
    return next();
  }

  const url: string = req.url.endsWith("/") ? req.url : req.url + "/";
  const htmlfilePath: string = path.join(
    pathAlias.client,
    "/dist/pages",
    url,
    "index.html"
  );
  const html: string = fs.readFileSync(htmlfilePath, "utf-8");

  const client: Client = require(`../../../../pages${url + "index.js"}`);
  const Component: ReactElement = client.default;
  const type: string = client.SSG ? "SSG" : client.SSR ? "SSR" : "DEFAULT";

  const result: Data = await Fetch.getProps(type, client[type]);

  const app: string = getHTML(Component, result.renderProps, [
    url + "index.js",
  ]);

  if (html === app) {
    const dir = new Directory();
    dir.clearWriteSync(htmlfilePath);
    dir.updateWriteSync(htmlfilePath, app);
  }

  return res.send(app);
}
