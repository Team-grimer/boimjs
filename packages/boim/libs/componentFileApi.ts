import fs from "fs";

import pathAlias from "./pathAlias";

export default class ComponentPath {
  appPath: string;
  documentPath: string;

  getComponentPath() {
    this.appPath = "";
    this.documentPath = "";

    const directoryList = fs.readdirSync(`${pathAlias.client}/pages`);

    directoryList.forEach((value) => {
      if (value === "_app.js" || value === "_app.ts") {
        this.appPath = `${pathAlias.client}/pages/${value}`;
        return;
      }

      if (value === "_document.js" || value === "_document.ts") {
        this.documentPath = `${pathAlias.client}/pages/${value}`;
        return;
      }

      if (this.appPath === "") {
        this.appPath = `${pathAlias.root}/pages/_app.tsx`;
        return;
      }

      if (this.documentPath == "") {
        this.documentPath = `${pathAlias.root}/pages/_document.tsx`;
        return;
      }
    });

    return {
      _app: this.appPath,
      _document: this.documentPath,
    };
  }
}
