import React, { ReactElement, useContext, useEffect } from "react";

import Context from "../libs/contextApi";

const isServer = typeof window === "undefined";

interface Props {
  lang?: string | "en";
  children?: React.ReactNode | null;
}

const { HtmlContext, HeadContext } = Context;

export function Html({ lang = "en", children }: Props): ReactElement {
  const { docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Html = true;

  return (
    <html lang={lang}>
      <head></head>
      {children}
    </html>
  );
}

export function Head({ children }: Props): ReactElement {
  const { setHead, headInstance } = useContext(HeadContext);
  const { docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Head = true;

  if (isServer) {
    setHead(children);
  }

  useEffect(() => {
    headInstance.add(children);
    setHead([...headInstance]);

    return () => {
      headInstance.delete(children);
      setHead([...headInstance]);
    };
  });

  return null;
}

function Body({ children }: Props): ReactElement {
  return <div id="__boim">{children}</div>;
}

export function Main(): ReactElement {
  const { context, docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Main = true;

  return <Body>{context.main}</Body>;
}

export function Script(): ReactElement {
  const { context, docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Script = true;

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
