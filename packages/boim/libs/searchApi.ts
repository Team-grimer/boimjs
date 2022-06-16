import fs from "fs";

import pathAlias from "./pathAlias";

interface Injection {
  html: string | null;
  css: string | null;
  js: string | null;
}

export default class Search {
  static appPath: string;
  static documentPath: string;

  static getComponentPath() {
    Search.appPath = "";
    Search.documentPath = "";

    const directoryList = fs.readdirSync(`${pathAlias.client}/pages`);

    directoryList.forEach((value) => {
      if (value === "_app.js" || value === "_app.ts") {
        Search.appPath = `${pathAlias.client}/pages/${value}`;
        return;
      }

      if (value === "_document.js" || value === "_document.ts") {
        Search.documentPath = `${pathAlias.client}/pages/${value}`;
        return;
      }

      if (Search.appPath === "") {
        Search.appPath = `${pathAlias.root}/pages/_app.tsx`;
        return;
      }

      if (Search.documentPath == "") {
        Search.documentPath = `${pathAlias.root}/pages/_document.tsx`;
        return;
      }
    });

    return {
      _app: Search.appPath,
      _document: Search.documentPath,
    };
  }

  static getInjectionFile(
    data: object,
    url: string,
    requestUrl: string
  ): Injection {
    const manifestEntries: Array<string> = Object.keys(data);

    const injectionFile: Injection = {
      html: null,
      css: null,
      js: null,
    };

    manifestEntries.forEach((entry: string) => {
      const requestUrlSlices: Array<string> = requestUrl.split("/");
      const entrySlices: Array<string> = entry.split("/");

      if (entrySlices[entrySlices.length - 1].endsWith(".html")) {
        entrySlices.shift();
      }

      while (requestUrlSlices.length) {
        const reqUrlSlice: string = requestUrlSlices.shift();
        const entrySlice: string = entrySlices.shift();

        if (reqUrlSlice !== entrySlice) {
          entrySlices.push(entrySlice);
        }
      }

      if (entrySlices.length === 1) {
        if (entrySlices[0].endsWith(".css")) {
          injectionFile.css = url + entrySlices[0];
        }
        if (entrySlices[0].endsWith(".js")) {
          injectionFile.js = url + entrySlices[0];
        }
        if (entrySlices[0].endsWith(".html")) {
          injectionFile.html = "." + url + entrySlices[0];
        }
      }
    });

    return injectionFile;
  }
}
