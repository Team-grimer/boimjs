import path from "path";
import fs from "fs";

import React from "react";

import { Request, Response, NextFunction } from "express";

import { getHTML } from "../pages/templates/htmlTemplate";
import Directory from "../libs/directoryApi";
import pathAlias from "../libs/pathAlias";
import Fetch from "../libs/fetchApi";
import Search from "../libs/searchApi";
import { EXT, RENDER_PROPS_TYPE } from "../common/constants";

interface Client {
  default: React.FC;
  SSG?: object;
  SSR?: object;
}

interface Resource {
  htmlFilePath: string | null;
  htmlFile: string | null;
  component: React.FC | null;
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
const buildId = Math.random().toString(26).slice(2);
const isDevelopment = process.env.NODE_ENV === "development";

export default async function handleGetPage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<unknown, Record<string, unknown>> | void> {
  try {
    if (req.url.endsWith("/favicon.ico")) {
      if (!isDevelopment) {
        res.set("Cache-Control", "public, must-revalidate, max-age=31557600");
      } 
      return res.end();
    }

    if (
      req.url.endsWith(EXT.js) ||
      req.url.endsWith(EXT.css) ||
      req.url.endsWith(EXT.png) ||
      req.url.endsWith(EXT.jpg) ||
      req.url.endsWith(EXT.jpeg) ||
      req.url.endsWith(EXT.gif) ||
      req.url.endsWith(EXT.svg) ||
      req.url.endsWith(EXT.txt)
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

    let mamifeatResult: ManifestResult;

    try {
      mamifeatResult = Search.searchManifest(
        manifestData,
        dynamicManifestData,
        url
      );
    } catch (err) {
      res.statusCode = 404;
      next(err);
      return;
    }

    const { staticResult, dynamicResult } = mamifeatResult;

    let resource: Resource;

    if (staticResult.hasValue && dynamicResult.hasValue) {
      resource = await getResources(
        url,
        "dynamic",
        staticResult,
        dynamicResult
      );
    } else {
      const routeType: string = staticResult.hasValue ? "static" : "dynamic";
      resource = await getResources(
        url,
        routeType,
        staticResult,
        dynamicResult
      );
    }

    let newHtml: string;

    if (process.env.NODE_ENV !== "production") {
      try {
        newHtml = getHTML(
          resource.component,
          resource.componentProps,
          resource.cssList,
          resource.scriptList
        );
      } catch (err) {
        res.statusCode = 500;
        next(err);
        return;
      }
    } else {
      newHtml = getHTML(
        resource.component,
        resource.componentProps,
        resource.cssList,
        resource.scriptList
      );
    }

    if (resource.htmlFile !== newHtml) {
      dir.clearWriteSync(resource.htmlFilePath);
      dir.updateWriteSync(resource.htmlFilePath, newHtml);
    }

    if (resource.renderType === RENDER_PROPS_TYPE.ssg || resource.renderType === RENDER_PROPS_TYPE.default) {
      if (!isDevelopment) {
        res.set("Cache-Control", "public, must-revalidate, max-age=31557600");
        res.set({ ETag: buildId });
      }

      const htmlFile = fs.readFileSync(resource.htmlFilePath, "utf-8");
      res.send(htmlFile);
      return;
    }

    if (!isDevelopment) {
      res.set("Cache-Control", "no-store");
    }
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
    const client: Client = require(`../../../pages${url}/index.js`);

    values.renderType =
      client.SSG
        ? RENDER_PROPS_TYPE.ssg
        : client.SSR
          ? RENDER_PROPS_TYPE.ssr
          : RENDER_PROPS_TYPE.default;
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
    const client: Client = require(`../../../pages${clientFileUrl}`);

    values.renderType = RENDER_PROPS_TYPE.ssg;
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
