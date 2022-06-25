import fs from "fs";

import pathAlias from "./pathAlias";
import { EXT, BASE_COMPONENT } from "../common/constants";

interface File {
  key: string;
  value: string;
}
interface ExpectFiles {
  html: Array<string>;
  js: Array<string>;
  css: Array<string>;
}

interface FoundFiles {
  html: Array<File>;
  js: Array<File>;
  css: Array<File>;
}

interface FileInfo {
  fileInfo: FoundFiles;
  hasValue: boolean;
}

export default class Search {
  static appPath: string;
  static documentPath: string;

  static getFileList(directoryPath) {
    return fs.readdirSync(directoryPath);
  }

  static getBaseComponentPath(fileList) {
    Search.appPath = "";
    Search.documentPath = "";

    fileList.forEach((file) => {
      const fileName: string = file.split(".")[0];

      if (fileName === BASE_COMPONENT._app) {
        if (
          file.endsWith(EXT.js) ||
          file.endsWith(EXT.jsx) ||
          file.endsWith(EXT.ts) ||
          file.endsWith(EXT.tsx)
        ) {
          Search.appPath = `${pathAlias.client}/pages/${file}`;
          return;
        }
      }

      if (fileName === BASE_COMPONENT._document) {
        if (
          file.endsWith(EXT.js) ||
          file.endsWith(EXT.jsx) ||
          file.endsWith(EXT.ts) ||
          file.endsWith(EXT.tsx)
        ) {
          Search.documentPath = `${pathAlias.client}/pages/${file}`;
          return;
        }
      }
    });

    if (Search.appPath === "") {
      Search.appPath = `${pathAlias.root}/pages/_app.tsx`;
    }

    if (Search.documentPath == "") {
      Search.documentPath = `${pathAlias.root}/pages/_document.tsx`;
    }

    return {
      _app: Search.appPath,
      _document: Search.documentPath,
    };
  }

  static searchManifest(staticFiles, dynamicFiles, url) {
    const expectFiles = createExpectFileName(url);
    const staticResult = getFilesInfo(staticFiles, expectFiles);
    const dynamicResult = getFilesInfo(dynamicFiles, expectFiles);

    if (!staticResult.hasValue && !dynamicResult.hasValue) {
      throw new Error("Page Not Found");
    }

    return { staticResult, dynamicResult };
  }
}

const createExpectFileName = (reqUrl: string): ExpectFiles => {
  const result: ExpectFiles = {
    html: [],
    js: [],
    css: [],
  };

  const extensions = ["html", "js", "css"];

  extensions.forEach((extension) => {
    const isRootUrl: boolean = reqUrl.length === 0;

    if (extension === "html") {
      result[extension].push(`.${reqUrl}/index.${extension}`);
      !isRootUrl && result[extension].push(`.${reqUrl}.${extension}`);
      return;
    }

    result[extension].push(`${reqUrl}/index.${extension}`);
    !isRootUrl && result[extension].push(`${reqUrl}.${extension}`);
  });

  return result;
};

const getFilesInfo = (
  manifestList: object,
  expectFiles: ExpectFiles
): FileInfo => {
  const fileInfo = {
    html: [],
    js: [],
    css: [],
  };

  let hasValue = false;

  expectFiles.html.forEach((_, index) => {
    if (manifestList.hasOwnProperty(expectFiles.html[index])) {
      hasValue = true;
      fileInfo.html.push({
        key: expectFiles.html[index],
        value: manifestList[expectFiles.html[index]],
      });
    }

    if (manifestList.hasOwnProperty(expectFiles.js[index])) {
      fileInfo.js.push({
        key: expectFiles.js[index],
        value: manifestList[expectFiles.js[index]],
      });
    }

    if (manifestList.hasOwnProperty(expectFiles.css[index])) {
      fileInfo.css.push({
        key: expectFiles.css[index],
        value: manifestList[expectFiles.css[index]],
      });
    }
  });

  return { fileInfo, hasValue };
};
