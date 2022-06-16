import React, { ReactElement } from "react";

import _Document from "document";
import _App from "app";
import ReactDOMServer from "react-dom/server";

import Context from "../../libs/contextApi";

const { HtmlProvider, HeadProvider } = Context;

interface HTMLProps {
  main: ReactElement;
  srcList: Array<string>;
}

interface HEADProps {
  headList?: Array<React.ReactNode> | null;
}

function DefaultHead(): ReactElement {
  return (
    <head>
      <meta charSet="utf-8"></meta>
      <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
      <title>Boim js</title>
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

function CustomHead({ headList }: HEADProps) {
  return (
    <>
      {headList.length ? (
        <head>{headList.map((value) => value)}</head>
      ) : (
        <DefaultHead />
      )}
    </>
  );
}

export function getHTML(
  Component: ReactElement,
  pageProps: object,
  srcList: Array<string>
): string {
  const headComponentList: Array<React.ReactNode> = [];
  const htmlProps: HTMLProps = {
    main: renderPageTree(_App, Component, pageProps),
    srcList: srcList,
  };

  const htmlContextValue = {
    context: htmlProps,
  };
  const headContextValue = {
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
  const head: string = ReactDOMServer.renderToString(
    <CustomHead headList={headComponentList} />
  );

  html = html.replace("<head></head>", head);

  return html;
}
