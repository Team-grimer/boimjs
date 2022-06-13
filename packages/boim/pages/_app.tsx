import React, { ReactElement } from "react";

interface Props {
  Component: React.FunctionComponent<unknown>;
  pageProps?: {
    props: object;
  };
}

export default function App({ Component, pageProps }: Props): ReactElement {
  return <Component {...pageProps.props} />;
}
