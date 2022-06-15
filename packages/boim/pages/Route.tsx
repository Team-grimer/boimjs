import React, { useState, useEffect } from "react";

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
  componentPath: string;
}

export function RouteProvider({ routeInfo }: RouteProps) {
  const [routeContext, setRouteContext] = useState(routeInfo);
  const [result, setResult] = useState({ renderProps: { props: {} } });
  const [headList, setHeadList] = useState([]);

  useEffect(() => {
    async function setComponentProps() {
      const result = await Fetch.getProps(type, app[type]);
      setResult(result);
    }

    setComponentProps();
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

  const Component = app["default"];
  const type = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";

  const path = routeContext.path.replace("index", "");
  history.push(path);

  const headContextValue = {
    setHead: (headChildren) => {
      // 헤당 로직 수정
      // setHeadList((prevSate) => [...prevSate, headChildren]);
    },
  };

  return (
    <RouterProvider value={{ routeContext, setRouteContext }}>
      <HeadProvider value={headContextValue}>
        <Component {...result.renderProps.props} />
      </HeadProvider>
    </RouterProvider>
  );
}
