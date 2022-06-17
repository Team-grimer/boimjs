import fs from "fs";
import path from "path";

import pathAlias from "./pathAlias";

export default class Directory {
  filePaths: { [key: string]: string };
  cssFiles: { [key: string]: string };

  constructor() {
    this.filePaths = {};
    this.cssFiles = {};
  }

  getFilePaths(): { [key: string]: string } {
    return this.filePaths;
  }

  getCssFiles(): { [key: string]: string } {
    return this.cssFiles;
  }

  searchDirectory(startDirectoryPath: string): void {
    const recursivelySearchDirectory = (directoryPath: string): void => {
      fs.readdirSync(directoryPath).forEach((file: string) => {
        const Absolute: string = path.join(directoryPath, file);

        if (fs.statSync(Absolute).isDirectory()) {
          recursivelySearchDirectory(Absolute);
          return;
        }

        if (Absolute.match(/\.(css|less|sass|scss)$/)) {
          const fileName: string = Absolute.replace(startDirectoryPath, "")
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

  writeHydrateComponent(entries: { [key: string]: string }): void {
    fs.mkdirSync(`${pathAlias.root}/client/hydratedComponents`, {
      recursive: true,
    });

    function isFile(dir: string): boolean {
      return dir.lastIndexOf("/") === 0;
    }

    function isRoot(dir: string): boolean {
      return dir === "/index";
    }

    for (const dir of Object.keys(entries)) {
      const componentsPath = `${pathAlias.client}/pages`;
      const outPath = `${pathAlias.root}/client/hydratedComponents`;

      const content = `import React from "react";
import ReactDOM from "react-dom";
import * as App from "${componentsPath + dir}.js";
import Fetch from "${pathAlias.root}/libs/fetchApi";
import Route from "${pathAlias.root}/pages/Route";

const app = {};

Object.entries(App).forEach(([key, value]) => {
  app[key] = value;
});

const Component = app["default"];
const type = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";

async function hydrate() {
  const result = await Fetch.getProps(type, app[type]);
  const container = document.getElementById("__boim");

  ReactDOM.hydrate(<Route initialInfo={{ result, Component }} />, container);
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
