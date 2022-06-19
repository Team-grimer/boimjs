/**
 * @jest-environment jsdom
 */
import React from "react";

import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import { Html, Head, Main, Script } from "../pages/_document";
import Context from "../libs/contextApi";

const { HtmlProvider, HeadProvider } = Context;

describe.only("_document component", () => {
  test("Html Component render and props test", () => {
    function Test() {
      return <div>TEST</div>;
    }

    const elementHtml = renderToString(
      <Html>
        <Test />
      </Html>
    );

    expect(elementHtml).toContain("TEST");
  });

  test("Head Component render and props test", () => {
    const mockSetHead = jest.fn();

    render(
      <HtmlProvider
        value={{
          context: {
            main: null,
            scriptList: null,
          },
        }}
      >
        <HeadProvider
          value={{ setHead: mockSetHead, cssList: [], headInstance: new Set() }}
        >
          <Head>
            <title>성공</title>
          </Head>
        </HeadProvider>
      </HtmlProvider>
    );

    expect(mockSetHead).toBeCalledTimes(1);
  });

  test("Main Component render and props test", () => {
    function Test() {
      return <div>TEST</div>;
    }

    const elementHtml = renderToString(
      <HtmlProvider
        value={{
          context: {
            main: <Test />,
            scriptList: null,
          },
        }}
      >
        <Main />
      </HtmlProvider>
    );

    expect(elementHtml).toContain("TEST");
    expect(elementHtml).toContain("__boim");
  });

  test("Script Component render and props test", () => {
    const mockScriptList = ["index,js"];

    const elementHtml = renderToString(
      <HtmlProvider
        value={{
          context: {
            main: null,
            scriptList: mockScriptList,
          },
        }}
      >
        <Script />
      </HtmlProvider>
    );

    expect(elementHtml).toContain("index,js");
  });
});
