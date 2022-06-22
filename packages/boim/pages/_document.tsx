import React, { useContext, useEffect } from "react";

import Context from "../libs/contextApi";

const isServer = typeof window === "undefined";

interface Props {
  lang?: string | "en";
  children?: React.ReactNode | null;
}

const { HtmlContext, HeadContext } = Context;

export const Html: React.FC<Props> = ({ lang = "en", children }) => {
  const { docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Html = true;

  return (
    <html lang={lang}>
      <head></head>
      {children}
    </html>
  );
};

export const Head: React.FC<Props> = ({ children }) => {
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
};

export const Body: React.FC<Props> = ({ children }) => {
  return <div id="__boim">{children}</div>;
};

export const Main: React.FC = () => {
  const { context, docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Main = true;

  return <Body>{context.main}</Body>;
};

export const Script: React.FC = () => {
  const { context, docComponentRendered } = useContext(HtmlContext);

  docComponentRendered.Script = true;

  return (
    <>
      {context.scriptList.map((path) => (
        <script key={path} src={path}></script>
      ))}
    </>
  );
};

const Document: React.FC = () => {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <Script />
      </body>
    </Html>
  );
};

export default Document;
