import path from "path";

import pathAlias from "../libs/pathAlias";

describe("pathAlias module test", () => {
  test("pathAlias should return object.", () => {
    expect(typeof pathAlias).toBe("object");
  });

  test("pathAlias should have root path based on the current location.", () => {
    expect(pathAlias.root).toBe(path.resolve("./"));
  });
});
