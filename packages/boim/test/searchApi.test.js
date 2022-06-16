import fs from "fs";

import Search from "../libs/searchApi";
import PathAlias from "../libs/pathAlias";

describe("searchApi test", () => {
  test("type test", () => {
    expect(typeof Search.appPath).toBe("undefined");
    expect(typeof Search.documentPath).toBe("undefined");
    expect(typeof Search.getFileList).toBe("function");
    expect(typeof Search.getBaseComponentPath).toBe("function");
    expect(typeof Search.getInjectionFile).toBe("function");
  });

  test("getInjectionFile static method test", () => {
    const jsonFile = fs.readFileSync(
      __dirname + "/sample/searchSample.json",
      "utf-8"
    );
    const data = JSON.parse(jsonFile);
    const url = "/post/";
    const requestUrl = "/post";
    const injectionFile = Search.getInjectionFile(data, url, requestUrl);

    expect(injectionFile.html).toBe("./post/index.html");
    expect(injectionFile.css).toBe("/post/index.css");
    expect(injectionFile.js).toBe("/post/index.js");
  });

  test("getFileList static metho test", () => {
    const tempFileList = fs.readdirSync(`${PathAlias.client}/pages`);
    const fileList = Search.getFileList(`${PathAlias.client}/pages`);

    expect(tempFileList.length).toBe(fileList.length);
  });

  test("getBaseComponentPath static metho test", () => {
    const mockFileListWithoutDocumentFile = ["_app.js"];
    const mockFileListWithoutAppFile = ["_document.js"];
    const mockFileListWithoutBothFile = ["index.js"];

    const resultWithoutDocumentFile = {
      _app: `${PathAlias.client}/pages/_app.js`,
      _document: `${PathAlias.root}/pages/_document.tsx`,
    };
    const resultWithoutAppFile = {
      _app: `${PathAlias.root}/pages/_app.tsx`,
      _document: `${PathAlias.client}/pages/_document.js`,
    };
    const resultWithoutBothFile = {
      _app: `${PathAlias.root}/pages/_app.tsx`,
      _document: `${PathAlias.root}/pages/_document.tsx`,
    };

    expect(
      Search.getBaseComponentPath(mockFileListWithoutDocumentFile)
    ).toStrictEqual(resultWithoutDocumentFile);
    expect(
      Search.getBaseComponentPath(mockFileListWithoutAppFile)
    ).toStrictEqual(resultWithoutAppFile);
    expect(
      Search.getBaseComponentPath(mockFileListWithoutBothFile)
    ).toStrictEqual(resultWithoutBothFile);
  });
});
