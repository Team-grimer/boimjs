import React, { ReactElement } from "react";

import _Document from "document";
import _App from "app";
import ReactDOMServer from "react-dom/server";

import Context from "../../libs/contextApi";

const { HtmlProvider, HeadProvider } = Context;

interface HTMLProps {
  main: ReactElement;
  scriptList: Array<string>;
}

interface HEADProps {
  headList?: Array<React.ReactNode> | null;
  cssList?: Array<string> | null;
}

function DefaultHead(): ReactElement {
  return (
    <>
      <meta charSet="utf-8"></meta>
      <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
      <title>Boim js</title>
    </>
  );
}

function CustomHead({ headList, cssList }: HEADProps): ReactElement {
  return (
    <head>
      {headList.length ? (
        <>{headList.map((value) => value)}</>
      ) : (
        <DefaultHead />
      )}

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
    <CustomHead
      headList={headComponentList}
      cssList={headContextValue.cssList}
    />
  );

  html = html.replace("<head></head>", head);

  return html;
}
