import React, { ReactElement } from "react";

import _Document from "document";
import _App from "app";
import ReactDOMServer from "react-dom/server";
import { parse } from "node-html-parser";

import Context from "../../libs/contextApi";

interface HTMLProps {
  main: ReactElement;
  scriptList: Array<string>;
}

interface HEADProps {
  headList?: Array<React.ReactNode> | null;
  cssList?: Array<string> | null;
}

const { HtmlProvider, HeadProvider } = Context;

const headTargetList: Array<string> = [
  "meta[charset]",
  'meta[name="viewport"]',
  "title",
];
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
  pageProps: object
): ReactElement {
  return <App Component={Component} pageProps={pageProps} />;
}

function setHead(defaultHeadTag, customHeadTagString, targetList) {
  const originalDocument = parse(defaultHeadTag);
  const customHeadDocument = parse(customHeadTagString);

  targetList.forEach((value) => {
    if (customHeadDocument.querySelector(value)) {
      originalDocument.querySelector(value).remove();
    }
  });

  originalDocument.querySelector("head").appendChild(customHeadDocument);

  return originalDocument.toString();
}

export function getHTML(
  Component: ReactElement,
  pageProps: object,
  cssList: Array<string>,
  scriptList: Array<string>
): string {
  const htmlProps: HTMLProps = {
    main: renderPageTree(_App, Component, pageProps),
    scriptList,
  };

  const headComponentList: ReactElement[] = [];

  const htmlContextValue = {
    context: htmlProps,
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
  const customHeadTag: string = ReactDOMServer.renderToString(
    <CustomHead
      headList={headComponentList}
      cssList={headContextValue.cssList}
    />
  );

  const head: string = setHead(defaultHeadTag, customHeadTag, headTargetList);

  html = html.replace("<head></head>", head);

  return html;
}
