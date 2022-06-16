import fs from "fs";

import Search from "../libs/searchApi";

describe("searchApi test", () => {
  test("type test", () => {
    expect(typeof Search.appPath).toBe("undefined");
    expect(typeof Search.documentPath).toBe("undefined");
    expect(typeof Search.getComponentPath).toBe("function");
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
});
