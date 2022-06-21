import React, { ReactElement } from "react";

import _Document from "document";
import _App from "app";
import ReactDOMServer from "react-dom/server";
import { parse, HTMLElement } from "node-html-parser";

import Context from "../../libs/contextApi";
import Document from "../../libs/documentApi";

interface HTMLProps {
  main: ReactElement;
  scriptList: Array<string>;
}

interface HEADProps {
  headList?: Array<React.ReactNode> | null;
  cssList?: Array<string> | null;
}

const { HtmlProvider, HeadProvider } = Context;

const defaultHeadTag = `<head><meta charSet="utf-8"></meta>
<meta name="viewport" content="width=device-width,initial-scale=1"></meta>
<title>Boim js</title></head>`;

function CustomHead({ headList, cssList }: HEADProps): ReactElement {
  return (
    <head>
      <>{headList.map((value) => value)}</>

      {cssList.length ? (
        <>
          {cssList.map((value, index) => {
            return <link key={index} rel="stylesheet" href={value}></link>;
          })}
        </>
      ) : undefined}
    </head>
  );
}

function renderPageTree(
  App: React.FunctionComponent<any>,
  Component: ReactElement,
  pageProps: any
): ReactElement {
  return <App Component={Component} pageProps={pageProps.renderProps} />;
}

function getHeadString(defaultHeadTag, customHeadTagString) {
  const originalDocument: HTMLElement = parse(defaultHeadTag);
  const customHeadDocument: HTMLElement = parse(customHeadTagString);

  const document: Document = new Document(
    originalDocument,
    null,
    customHeadDocument
  );

  document.removeDuplicateHead();
  originalDocument.querySelector("head").appendChild(customHeadDocument);

  return originalDocument.toString();
}

export function getHTML(
  Component: ReactElement,
  pageProps: object,
  cssList: Array<string>,
  scriptList: Array<string>
): string {
  if (process.env.NODE_ENV !== "production") {
    const isDoucment = React.isValidElement(_Document);

    if (!isDoucment) {
      throw new Error("Document file is return React Element");
    }
  }

  const htmlProps: HTMLProps = {
    main: renderPageTree(_App, Component, pageProps),
    scriptList,
  };

  const headComponentList: ReactElement[] = [];

  const htmlContextValue = {
    context: htmlProps,
    docComponentRendered: {
      Html: false,
      Main: false,
      Script: false,
      Head: false,
    },
  };

  const headContextValue = {
    cssList,
    headInstance: new Set(),
    setHead: (headChildren) => {
      if (headChildren) headComponentList.push(headChildren);
    },
  };

  const document: ReactElement = (
    <HtmlProvider value={htmlContextValue}>
      <HeadProvider value={headContextValue}>
        <_Document />
      </HeadProvider>
    </HtmlProvider>
  );

  let html: string = ReactDOMServer.renderToString(document);

  if (process.env.NODE_ENV !== "production") {
    const nonRenderedComponents = [];
    const expectedDocComponents = ["Main", "Head", "Script", "Html"];

    for (const comp of expectedDocComponents) {
      if (!htmlContextValue.docComponentRendered[comp]) {
        nonRenderedComponents.push(comp);
      }
    }

    if (nonRenderedComponents.length) {
      const missingComponentList = nonRenderedComponents
        .map((e) => `<${e} />`)
        .join(", ");
      const plural = nonRenderedComponents.length !== 1 ? "s" : "";
      throw new Error(
        `Your custom Document (pages/_document) did not render all the required subcomponent${plural}.\n` +
          `Missing component${plural}: ${missingComponentList}\n`
      );
    }
  }

  const customHeadTag: string = ReactDOMServer.renderToString(
    <CustomHead
      headList={headComponentList}
      cssList={headContextValue.cssList}
    />
  );

  const head: string = getHeadString(defaultHeadTag, customHeadTag);

  html = html.replace("<head></head>", head);

  return html;
}
