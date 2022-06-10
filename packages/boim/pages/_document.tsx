import React, { ReactElement, useContext } from "react";

import Context from "../libs/contextApi";

interface Props {
  lang?: string | "en";
  children?: React.ReactNode;
}


export function Html({ lang, children }: Props): ReactElement {
  return <html lang={lang}>{children}</html>;
}

export function Head(): ReactElement {
  return (
    <head>
      <meta charSet="utf-8"></meta>
      <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
      <title>Boim js</title>
    </head>
  );
}

function Body({ children }): ReactElement {
  return <div id="__boim">{children}</div>;
}

export function Main(): ReactElement {
  const { main } = useContext(Context.HtmlContext);

  return <Body>{main}</Body>;
}

export function Script(): ReactElement {
  const { srcList } = useContext(Context.HtmlContext);
  return (
    <>
      {srcList.map(path => <script key={path} src={path}></script>)}
    </>
  );
}

export default function Document(): ReactElement {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <Script />
      </body>
    </Html>
  );
}