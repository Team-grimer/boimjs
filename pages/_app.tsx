import React from "react";

interface Props {
  Component: React.FC;
  pageProps?: {
    props: object;
  };
}

const App: React.FC<Props> = ({ Component, pageProps }) => {
  return <Component {...pageProps.props} />;
};

export default App;
