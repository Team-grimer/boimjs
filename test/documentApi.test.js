import { JSDOM } from "jsdom";

import Document from "../libs/documentApi";

describe("documentApi test", () => {
  let documentObject;
  let headElement;
  let customHeadElement;

  beforeEach(() => {
    const dom = new JSDOM();
    const document = dom.window.document;

    const defaultHeadElement = document.createElement("head");

    headElement = document.createElement("head");
    customHeadElement = document.createElement("head");

    headElement.innerHTML = "<title>original</title>";
    defaultHeadElement.innerHTML = "<title>default</title>";
    customHeadElement.innerHTML = "<title>custom</title>";

    documentObject = new Document(
      headElement,
      defaultHeadElement,
      customHeadElement
    );
  });

  test("Document type test", () => {
    expect(typeof documentObject.setElement).toBe("function");
    expect(typeof documentObject.removeChildrenOfHeadElement).toBe("function");
    expect(typeof documentObject.removeDuplicateHead).toBe("function");
    expect(typeof documentObject.addDefaultHeadChildren).toBe("function");
    expect(typeof documentObject.addCustomHeadChildren).toBe("function");
    expect(typeof documentObject.addChildrenToTarget).toBe("function");
  });

  test("Document constructor test", () => {
    expect(documentObject.headElement.querySelector("title").textContent).toBe(
      "original"
    );
    expect(
      documentObject.defaultHeadElement.querySelector("title").textContent
    ).toBe("default");
    expect(
      documentObject.customHeadElement.querySelector("title").textContent
    ).toBe("custom");
  });

  test("Document removeChildrenOfHeadElement method test", () => {
    documentObject.removeChildrenOfHeadElement();

    expect(documentObject.headElement.innerHTML).toBe("");
  });

  test("Document removeDuplicateHead method test", () => {
    documentObject.removeDuplicateHead();

    expect(documentObject.headElement.innerHTML).toBe("");
  });

  test("Document addChildrenToTarget method test", () => {
    documentObject.addChildrenToTarget(headElement, customHeadElement.children);

    expect(
      documentObject.headElement.querySelectorAll("title")[1].textContent
    ).toBe("custom");
  });
});
