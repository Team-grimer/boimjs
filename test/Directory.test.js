import Directory from "../packages/boim/libs/directoryApi";


describe("Directory class test", () => {
  const dir = new Directory();

  test("defines setRule()", () => {
    expect(typeof dir.getFilePaths).toBe("function");
    expect(typeof dir.getCssFiles).toBe("function");
    expect(typeof dir.searchDirectory).toBe("function");
    expect(typeof dir.clearWriteSync).toBe("function");
    expect(typeof dir.updateWriteSync).toBe("function");
    expect(typeof dir.writeHydrateComponent).toBe("function");
  });
});
