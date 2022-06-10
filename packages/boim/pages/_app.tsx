import React, { ReactElement } from "react";

interface Props {
    Component: React.FunctionComponent<any>;
    pageProps?: object;
}

export default function App({ Component, pageProps }: Props): ReactElement {
  return <Component {...pageProps} />;
}
