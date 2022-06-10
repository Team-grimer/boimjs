import React, { JSXElementConstructor, ReactElement } from "react";

import ReactDOMServer from "react-dom/server";

import _App from "../_app";
import _Document from "../_document";
import Context from "../../libs/contextApi";

interface HTMLProps {
  main: ReactElement<any, string | JSXElementConstructor<any>>;
  srcList: Array<string>;
}

function renderPageTree (App: any, Component: ReactElement, props: object | undefined): ReactElement {
  return <App Component={Component} pageProps={props} />;
}

export function getHTML(Component: ReactElement, srcList: Array<string>): string {
  const htmlProps: HTMLProps = {
    main: renderPageTree(_App, Component, {}),
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