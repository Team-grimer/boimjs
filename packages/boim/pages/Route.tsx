import React, { useState, useEffect, ReactElement } from "react";

import qs from "querystringify";

import Context from "../libs/contextApi";
import Fetch from "../libs/fetchApi";
import History from "../libs/historyApi";

interface RouteProps {
  initialInfo: {
    result: {
      [key: string]: any;
    };
    Component: React.FC;
  };
}

interface PageProps {
  componentInfo: {
    result: {
      [key: string]: any;
    };
    Component: React.FC;
  };
}

interface RouteState {
  isSSR: boolean;
  path: string;
  param: {
    [key: string]: any;
  };
  query: {
    [key: string]: string;
  };
}

interface RenderInfo {
  context: {
    push: (pathName: string, param: { [key: string]: any }) => void;
    path: string;
    param: {
      [key: string]: any;
    };
    query: {
      [key: string]: string;
    };
  };
  renderOption: {
    result: {
      [key: string]: any;
    };
    Component: React.FC;
  };
}

const { RouterProvider } = Context;
const history = History.history;

const MemoedPage: React.FC<PageProps> = React.memo(Page);

function Page({ componentInfo }: PageProps): ReactElement {
  return (
    <componentInfo.Component {...componentInfo.result.renderProps.props} />
  );
}

export default function Route({ initialInfo }: RouteProps): ReactElement {
  const [routeStatus, setRouteStatus] = useState<RouteState>({
    isSSR: true,
    path: "",
    param: {},
    query: {},
  });

  const [renderInfo, setRenderInfo] = useState<RenderInfo>({
    context: {
      push: (pathName, state) => {
        history.push(pathName, state);
      },
      path: "",
      param: {},
      query: {},
    },
    renderOption: {
      ...initialInfo,
    },
  });

  useEffect(() => {
    const unlisten: () => void = history.listen(({ location }) => {
      setRouteStatus({
        isSSR: false,
        path: location.pathname,
        param: location.state,
        query: qs.parse(location.search),
      });
    });

    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (routeStatus.isSSR) {
      return;
    }

    const App = require(`../../../../pages${routeStatus.path}`);
    const app = {};

    Object.entries(App).forEach(([key, value]) => {
      app[key] = value;
    });

    const Component: React.FC = app["default"];
    const type: string = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";

    async function getComponentProps() {
      const componentProps = await Fetch.getProps(type, app[type]);

      setRenderInfo({
        context: {
          ...renderInfo.context,
          path: routeStatus.path,
          param: routeStatus.param,
          query: routeStatus.query,
        },
        renderOption: {
          Component,
          result: componentProps,
        },
      });
    }

    getComponentProps();
  }, [routeStatus]);

  const headContextValue = {
    cssList: null,
    setHead: (headChildren) => {
      return null;
    },
  };

  return (
    <RouterProvider value={renderInfo.context}>
      <MemoedPage componentInfo={renderInfo.renderOption} />
    </RouterProvider>
  );
}
