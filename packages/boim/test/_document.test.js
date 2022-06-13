/**
 * @jest-environment jsdom
 */
import React from "react";

import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import { Html, Head, Main, Script } from "../pages/_document";
import Context from "../libs/contextApi";

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
      <Context.ContextProvider
        value={{
          context: {
            main: null,
            srcList: null,
            head: null,
          },
          setHead: mockSetHead,
        }}
      >
        <Head>
          <title>성공</title>
        </Head>
      </Context.ContextProvider>
    );

    expect(mockSetHead).toBeCalledTimes(1);
  });

  test("Main Component render and props test", () => {
    function Test() {
      return <div>TEST</div>;
    }

    const elementHtml = renderToString(
      <Context.ContextProvider
        value={{
          context: {
            main: <Test />,
            srcList: null,
            head: null,
          },
          setHead: null,
        }}
      >
        <Main />
      </Context.ContextProvider>
    );

    expect(elementHtml).toContain("TEST");
    expect(elementHtml).toContain("__boim");
  });

  test("Script Component render and props test", () => {
    const mockScriptList = ["index,js"];

    const elementHtml = renderToString(
      <Context.ContextProvider
        value={{
          context: {
            main: null,
            srcList: mockScriptList,
            head: null,
          },
          setHead: null,
        }}
      >
        <Script />
      </Context.ContextProvider>
    );

    expect(elementHtml).toContain("index,js");
  });
});
