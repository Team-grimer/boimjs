import React, { ReactElement } from "react";

import ReactDOMServer from "react-dom/server";

import _App from "../_app";
import _Document from "../_document";
import Context from "../../libs/contextApi";

interface HTMLProps {
  main: ReactElement;
  srcList: Array<string>;
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
  srcList: Array<string>
): string {
  const htmlProps: HTMLProps = {
    main: renderPageTree(_App, Component, pageProps),
    srcList,
  };

  const document: ReactElement = (
    <Context.HtmlContext.Provider value={htmlProps}>
      <_Document />
    </Context.HtmlContext.Provider>
  );

  const html: string = ReactDOMServer.renderToString(document);

  return html;
}
