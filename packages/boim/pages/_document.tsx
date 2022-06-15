import React, { ReactElement, useContext } from "react";

import Context from "../libs/contextApi";

interface Props {
  lang?: string | "en";
  children?: React.ReactNode | null;
}

const { HtmlContext, HeadContext } = Context;

export function Html({ lang = "en", children }: Props): ReactElement {
  return (
    <html lang={lang}>
      <head></head>
      {children}
    </html>
  );
}

export function Head({ children }: Props): ReactElement {
  const { setHead } = useContext(HeadContext);

  setHead(children);

  return null;
}

function Body({ children }: Props): ReactElement {
  return <div id="__boim">{children}</div>;
}

export function Main(): ReactElement {
  const { context } = useContext(HtmlContext);

  return <Body>{context.main}</Body>;
}

export function Script(): ReactElement {
  const { context } = useContext(HtmlContext);
  return (
    <>
      {context.scriptList.map((path) => (
        <script key={path} src={path}></script>
      ))}
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
