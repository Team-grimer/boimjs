import fs from "fs";

import Search from "../libs/searchApi";
import PathAlias from "../libs/pathAlias";

describe("searchApi test", () => {
  test("type test", () => {
    expect(typeof Search.appPath).toBe("undefined");
    expect(typeof Search.documentPath).toBe("undefined");
    expect(typeof Search.getFileList).toBe("function");
    expect(typeof Search.getBaseComponentPath).toBe("function");
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
