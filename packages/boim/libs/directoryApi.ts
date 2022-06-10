import fs from "fs";
import path from "path";

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
    fs.mkdirSync("../boim/client/hydratedComponents", { recursive: true });

    function isFile(dir: string): boolean {
      return dir.lastIndexOf("/") === 0;
    }

    function isRoot(dir: string): boolean {
      return dir === "/index";
    }

    for (const dir of Object.keys(entries)) {
      const componentsPath: string = path.resolve(__dirname, "../../pages");
      const outPath: string = path.resolve(
        __dirname,
        "../../boimjs/packages/boim/client/hydratedComponents"
      );

      const content = `import React from "react";
import ReactDOM from "react-dom";
import App from "${componentsPath + dir}.js";
const container = document.getElementById("__boim");
ReactDOM.hydrate(<App />, container);
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
