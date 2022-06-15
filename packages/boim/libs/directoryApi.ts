import fs from "fs";
import path from "path";

import pathAlias from "./pathAlias";

export default class Directory {
  filePaths: { [key: string]: string };
  cssFiles: Array<string>;

  constructor() {
    this.filePaths = {};
    this.cssFiles = [];
  }

  getFilePaths(): { [key: string]: string } {
    return this.filePaths;
  }

  getCssFiles(): Array<string> {
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

        if (Absolute.match(/\.css$/)) {
          this.cssFiles.push(Absolute);
          return;
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

  clearWriteSync(filepath: string): void {
    fs.readFileSync(filepath, "utf-8");
    fs.writeFileSync(filepath, "", "utf-8");
  }

  updateWriteSync(filepath: string, content: string): void {
    fs.readFileSync(filepath, "utf-8");
    fs.writeFileSync(filepath, content, "utf-8");
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
      const outPath = `${pathAlias.root}/client/hydratedComponents`;

      const content = `import React from "react";
import ReactDom from "react-dom";
import Context from "${pathAlias.root}/libs/contextApi";
import { RouteProvider } from "${pathAlias.root}/pages/Route"

const container = document.getElementById("__boim");

ReactDom.hydrate(<RouteProvider componentPath="../../../../" routeInfo={{path: "${dir}"}} />, container);
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
}
