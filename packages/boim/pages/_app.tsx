import React, { ReactElement } from "react";

interface Props {
  Component: React.FC<React.ReactNode>;
  pageProps?: {
    props: object;
  };
}

export default function App({ Component, pageProps }: Props): ReactElement {
  return <Component {...pageProps.props} />;
}
