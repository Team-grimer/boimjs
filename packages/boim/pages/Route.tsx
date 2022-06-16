import React, { useState, useEffect, ReactElement } from "react";

import { createBrowserHistory } from "history";
import ReactDom from "react-dom";

import Context from "../libs/contextApi";
import Fetch from "../libs/fetchApi";

const { RouterProvider, HeadProvider } = Context;
const history = createBrowserHistory();

interface RouteProps {
  routeInfo: {
    path: string;
  };
}

interface routeContext {
  path: string;
}

interface componentProps {
  renderProps: {
    props: {
      [key: string]: any;
    };
  };
}

export function RouteProvider({ routeInfo }: RouteProps) {
  const [routeContext, setRouteContext] = useState<routeContext>(routeInfo);
  const [componentProps, setComponentProps] = useState<componentProps>({
    renderProps: { props: {} },
  });
  const [headList, setHeadList] = useState<Array<React.ReactNode>>([]);

  useEffect(() => {
    async function getComponentProps() {
      const componentProps = await Fetch.getProps(type, app[type]);
      setComponentProps(componentProps);
    }

    getComponentProps();
  }, [routeContext]);

  useEffect(() => {
    function Head() {
      return <>{headList.map((value) => value)}</>;
    }

    if (headList.length > 0) {
      ReactDom.render(<Head />, document.querySelector("head"));
    }
  }, [headList]);

  const App = require(`../../../../pages${routeContext.path}`);
  const app = {};

  Object.entries(App).forEach(([key, value]) => {
    app[key] = value;
  });

  const Component: React.FC = app["default"];
  const type: string = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";

  const path: string = routeContext.path.replace("index", "");
  history.push(path);

  const headContextValue = {
    cssList: null,
    setHead: (headChildren) => {
      return null;
    },
  };

  return (
    <RouterProvider value={{ routeContext, setRouteContext }}>
      <HeadProvider value={headContextValue}>
        <Component {...componentProps.renderProps.props} />
      </HeadProvider>
    </RouterProvider>
  );
}
