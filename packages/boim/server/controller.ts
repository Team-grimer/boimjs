import path from "path";
import fs from "fs";

import { ReactElement } from "react";

import { Request, Response, NextFunction } from "express";

import { getHTML } from "../pages/templates/htmlTemplate";
import Directory from "../libs/directoryApi";
import pathAlias from "../libs/pathAlias";
import Fetch from "../libs/fetchApi";
import Search from "../libs/searchApi";

interface Client {
  default: ReactElement;
  SSG?: object;
  SSR?: object;
}

interface Resource {
  htmlFilePath: string | null;
  htmlFile: string | null;
  component: ReactElement | null;
  componentProps: any | null;
  renderType: string | null;
  cssList: Array<string>;
  scriptList: Array<string>;
}

interface File {
  key: string;
  value: string;
}

interface FileInfo {
  html: Array<File>;
  js: Array<File>;
  css: Array<File>;
}

interface SearchManifestResult {
  fileInfo: FileInfo;
  hasValue: boolean;
}

interface ManifestResult {
  staticResult: SearchManifestResult;
  dynamicResult: SearchManifestResult;
}

const dir = new Directory();

export default async function handleGetPage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<unknown, Record<string, unknown>> | void> {
  try {
    if (req.url.endsWith("/favicon.ico")) {
      res.set("Cache-Control", "public, must-revalidate, max-age=31557600");
      return res.end();
    }

    if (
      req.url.endsWith(".js") ||
      req.url.endsWith(".css") ||
      req.url.endsWith(".png") ||
      req.url.endsWith(".jpg") ||
      req.url.endsWith(".jpeg") ||
      req.url.endsWith(".gif") ||
      req.url.endsWith(".svg") ||
      req.url.endsWith(".txt")
    ) {
      return next();
    }

    const manifestData: object = dir.parseJsonSync(
      `${pathAlias.client}/dist/manifest.json`
    );
    const dynamicManifestData: object = dir.parseJsonSync(
      `${pathAlias.client}/dist/dynamicManifest.json`
    );

    const url: string = req.url.endsWith("/")
      ? req.url.slice(0, req.url.length - 1)
      : req.url;

    const { staticResult, dynamicResult }: ManifestResult =
      Search.searchManifest(manifestData, dynamicManifestData, url);

    let resource: Resource;

    if (staticResult.hasValue && dynamicResult.hasValue) {
      resource = await getResources(
        url,
        "dynamic",
        staticResult,
        dynamicResult
      );
    } else {
      const routeType = staticResult.hasValue ? "static" : "dynamic";
      resource = await getResources(
        url,
        routeType,
        staticResult,
        dynamicResult
      );
    }

    console.log("rescoure -------->", resource);
    console.log("rescoure.cssList -------->", resource.cssList);

    const newHtml: string = getHTML(
      resource.component,
      resource.componentProps,
      resource.cssList,
      resource.scriptList
    );

    console.log("new html =========>", newHtml);

    if (resource.renderType === "SSG" || resource.renderType === "DEFAULT") {
      res.set("Cache-Control", "public, must-revalidate, max-age=31557600");
      res.send(newHtml);
      return;
    }

    if (resource.htmlFile !== newHtml) {
      dir.clearWriteSync(resource.htmlFilePath);
      dir.updateWriteSync(resource.htmlFilePath, newHtml);
    }

    res.set("Cache-Control", "no-store");
    res.send(newHtml);
    return;
  } catch (e) {
    console.log("Error occurred in server.", e);
  }
}

const getOriginalDynamicUrl = (url, key) => {
  let result = url;

  if (url.endsWith("/")) {
    result = url.slice(0, url.length - 1);
  }
  const lastIndex = result.lastIndexOf("/");
  return `${result.slice(0, lastIndex)}/[${key}]/index.js`;
};

const getResources = async (
  url: string,
  routeType: string,
  staticResult: SearchManifestResult,
  dynamicResult: SearchManifestResult
): Promise<Resource> => {
  const values: Resource = {
    htmlFilePath: "",
    htmlFile: "",
    component: null,
    componentProps: null,
    renderType: "",
    cssList: [],
    scriptList: [],
  };

  const { value }: { value: string } =
    routeType === "static"
      ? staticResult.fileInfo.html[0]
      : dynamicResult.fileInfo.html[0];

  values.htmlFilePath = path.join(pathAlias.client, "/dist/pages", value);
  values.htmlFile = fs.readFileSync(values.htmlFilePath, "utf-8");

  if (routeType === "static") {
    const client: Client = require(`../../../../pages${url}/index.js`);

    values.renderType = client.SSG ? "SSG" : client.SSR ? "SSR" : "DEFAULT";
    values.component = client.default;
    values.componentProps = await Fetch.getProps(
      values.renderType,
      client[values.renderType]
    );
    values.scriptList = [staticResult.fileInfo.js[0]?.value];
    values.cssList = staticResult.fileInfo.css[0]
      ? [staticResult.fileInfo.css[0].value]
      : [];

    return values;
  }

  if (routeType === "dynamic") {
    const pagePropsData: any = dir.parseJsonSync(
      `${pathAlias.root}/client/dynamicComponents${url}.json`
    );
    const clientFileUrl: string = getOriginalDynamicUrl(
      url,
      pagePropsData.routeKey
    );
    const client: Client = require(`../../../../pages${clientFileUrl}`);

    values.renderType = "SSG";
    values.component = client.default;
    values.componentProps = pagePropsData;
    values.scriptList = [dynamicResult.fileInfo.js[0]?.value];
    values.cssList = dynamicResult.fileInfo.css[0]
      ? [dynamicResult.fileInfo.css[0].value]
      : [];

    return values;
  }

  return values;
};
