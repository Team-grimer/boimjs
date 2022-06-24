import fs from "fs";
import path from "path";

import "../config/fetchPolyfill";
import pathAlias from "./pathAlias";

interface pageProps {
  props: object;
}
export default class Directory {
  filePaths: { [key: string]: string };
  cssFiles: { [key: string]: string };
  assetFiles: { [key: string]: string };

  constructor() {
    this.filePaths = {};
    this.cssFiles = {};
    this.assetFiles = {};
  }

  getFilePaths(): { [key: string]: string } {
    return this.filePaths;
  }

  getCssFiles(): { [key: string]: string } {
    return this.cssFiles;
  }

  getAssetFiles(): { [key: string]: string } {
    return this.assetFiles;
  }

  async getDynamicRouteInfo() {
    const result: { [key: string]: Array<object> } = {};
    const dynamicPaths: { [key: string]: string } = this.getDynamicPaths(
      `${pathAlias.client}/pages`
    );

    for (const directoryPath of Object.keys(dynamicPaths)) {
      const dynamicComponent = require(`../../../pages${directoryPath}/index.js`);
      const app = Object.assign({}, dynamicComponent);

      if (dynamicComponent.hasOwnProperty("PATHS")) {
        const { paths } = await app.PATHS();
        result[directoryPath] = paths;
      }
    }

    return result;
  }

  getDynamicPaths(startDirectoryPath: string): { [key: string]: string } {
    const dynamicPaths: { [key: string]: string } = {};
    const recursivelySearchDynamicPath = (directoryPath: string): void => {
      fs.readdirSync(directoryPath).forEach((file: string) => {
        const Absolute: string = path.join(directoryPath, file);

        if (
          fs.statSync(Absolute).isDirectory() &&
          !(file.startsWith("[") && file.endsWith("]"))
        ) {
          recursivelySearchDynamicPath(Absolute);
          return;
        }

        if (file.startsWith("[") && file.endsWith("]")) {
          const fileKey: string = Absolute.replace(startDirectoryPath, "");
          const fileName: string = fs.readdirSync(Absolute)[0];

          dynamicPaths[fileKey] = `${Absolute}/${fileName}`;
        }
      });
    };
    recursivelySearchDynamicPath(startDirectoryPath);

    return dynamicPaths;
  }

  searchDirectory(startDirectoryPath: string): void {
    const recursivelySearchDirectory = (directoryPath: string): void => {
      fs.readdirSync(directoryPath).forEach((file: string) => {
        const Absolute: string = path.join(directoryPath, file);

        if (file.startsWith("[") && file.endsWith("]")) {
          return;
        }

        if (fs.statSync(Absolute).isDirectory()) {
          recursivelySearchDirectory(Absolute);
          return;
        }

        if (Absolute.match(/\.(svg|png|jpg|jpeg|gif|text)$/)) {
          const fileName: string = Absolute.replace(startDirectoryPath, "")
            .replace(".svg", "")
            .replace(".png", "")
            .replace(".gif", "")
            .replace(".text", "")
            .replace(".jpg", "")
            .replace(".jpeg", "");

          this.assetFiles[fileName] = Absolute;
        }

        if (Absolute.match(/\.(css|less|sass|scss|module.css)$/)) {
          const fileName: string = Absolute.replace(startDirectoryPath, "")
            .replace(".module.css", "")
            .replace(".css", "")
            .replace(".less", "")
            .replace(".sass", "")
            .replace(".scss", "");

          this.cssFiles[fileName] = Absolute;
        }

        if (Absolute.match(/\.(js|jsx|ts|tsx)$/)) {
          const fileName: string = Absolute.replace(
            startDirectoryPath,
            ""
          ).replace(".js", "");

          this.filePaths[fileName] = Absolute;
        }
      });
    };
    recursivelySearchDirectory(startDirectoryPath);
  }

  writeHydrateComponent(
    entries: { [key: string]: string },
    dynamicPaths
  ): void {
    fs.mkdirSync(`${pathAlias.root}/client/hydratedComponents`, {
      recursive: true,
    });

    const isFile = (dir: string): boolean => {
      return dir.lastIndexOf("/") === 0;
    };

    const isRoot = (dir: string): boolean => {
      return dir === "/index";
    };

    for (const dir of Object.keys(entries)) {
      const componentsPath = `${pathAlias.client}/pages`;
      const outPath = `${pathAlias.root}/client/hydratedComponents`;
      const content = `import React from "react";
import ReactDOM from "react-dom";
import * as App from "${componentsPath + dir}.js";
import Fetch from "${pathAlias.root}/libs/fetchApi";
import Route from "${pathAlias.root}/pages/Route";
import _App from "app";

const app = Object.assign({}, App);
const Component = app["default"];
const type = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";
const dynamicPathInfo = ${JSON.stringify(dynamicPaths)};

async function hydrate() {
  const initialProps = await Fetch.getProps(type, app[type]);
  const container = document.getElementById("__boim");

  ReactDOM.hydrate(<Route initialInfo={{ _App, initialProps, Component, dynamicPathInfo }} />, container);
}
hydrate();
`;

      try {
        !isFile(dir) &&
          !isRoot(dir) &&
          fs.mkdirSync(path.join(outPath, dir).replace("/index", ""), {
            recursive: true,
          });
        fs.writeFileSync(path.join(outPath, `${dir}.js`), content);
      } catch (e) {
        console.log("Cannot create folder and file ", e);
      }
    }
  }

  writeDynamicHydrateComponent(files: { [key: string]: string }): void {
    fs.mkdirSync(`${pathAlias.root}/client/dynamicComponents`, {
      recursive: true,
    });

    for (const directoryPath of Object.keys(files)) {
      const dynamicComponent = require(`../../../pages${directoryPath}/index.js`);
      const app = Object.assign({}, dynamicComponent);

      const createDynamicFiles = async (): Promise<void> => {
        const { paths } = await app.PATHS();

        paths.forEach(async (param) => {
          const pageProps: pageProps = await app.SSG(param);
          const props = JSON.stringify({
            renderType: "StaticSiteGeneration",
            renderProps: { props: pageProps.props },
          });

          const content = `
            import React from "react";
            import ReactDOM from "react-dom";
            import Component from "${pathAlias.client}/pages${directoryPath}/index.js";
            import Route from "${pathAlias.root}/pages/Route";
            import _App from "app";
            const dynamicPathInfo = ${JSON.stringify(files)};

            const initialProps = ${props}
            const container = document.getElementById("__boim");
            ReactDOM.hydrate(<Route initialInfo={{ _App, initialProps, Component, dynamicPathInfo }} />, container);
          `;

          const key: string = directoryPath
            .split("/")
            .pop()
            .replace("[", "")
            .replace("]", "");
          const paramKey: string = param.params[key];
          const outputKey: string = String(directoryPath).replace(
            `[${key}]`,
            paramKey
          );
          const outDir = `${pathAlias.root}/client/dynamicComponents`;

          try {
            fs.mkdirSync(
              path.join(outDir, String(directoryPath).replace(`/[${key}]`, "")),
              {
                recursive: true,
              }
            );
            fs.writeFileSync(path.join(outDir, `${outputKey}.js`), content);
            fs.writeFileSync(
              path.join(outDir, `${outputKey}.json`),
              JSON.stringify({
                ...JSON.parse(props),
                routeKey: key,
              })
            );
          } catch (e) {
            console.log("Cannot create folder and file ", e);
          }
        });
      };

      if (dynamicComponent.hasOwnProperty("PATHS")) {
        createDynamicFiles();
      }
    }
  }

  clearWriteSync(filepath: string): void {
    fs.readFileSync(filepath, "utf-8");
    fs.writeFileSync(filepath, "", "utf-8");
  }

  updateWriteSync(filepath: string, content: string): void {
    fs.readFileSync(filepath, "utf-8");
    fs.writeFileSync(filepath, content, "utf-8");
  }

  parseJsonSync(filepath: string): object {
    const jsonFile: string = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(jsonFile);
  }
}
