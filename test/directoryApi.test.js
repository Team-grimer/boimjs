import path from "path";
import fs from "fs";

import Directory from "../libs/directoryApi";

describe("directoryApi test", () => {
  const dir = new Directory();

  test("type test", () => {
    expect(typeof dir.getFilePaths).toBe("function");
    expect(typeof dir.getCssFiles).toBe("function");
    expect(typeof dir.searchDirectory).toBe("function");
    expect(typeof dir.clearWriteSync).toBe("function");
    expect(typeof dir.updateWriteSync).toBe("function");
    expect(typeof dir.writeHydrateComponent).toBe("function");
    expect(typeof dir.parseJsonSync).toBe("function");
  });

  test("method test", () => {
    dir.searchDirectory(path.resolve(__dirname, "../pages"));

    expect(typeof dir.filePaths).toBe("object");
    expect(dir.filePaths["/_app.tsx"]).toBeTruthy();

    const content = `import React from "react";

function Sample() {
  return <div>sample content</div>;
}

export default Sample;
    `;
    const samplePath = path.resolve(__dirname + "/sample/sample.js");
    const originData = fs.readFileSync(samplePath, "utf-8");
    dir.clearWriteSync(samplePath);
    const clearData = fs.readFileSync(samplePath, "utf-8");

    expect(clearData).toBe("");

    dir.updateWriteSync(samplePath, content);
    const updateData = fs.readFileSync(samplePath, "utf-8");

    expect(updateData.trim()).toBe(originData.trim());

    const data = dir.parseJsonSync(__dirname + "/sample/searchSample.json");

    expect(typeof data).toBe("object");
  });
});
