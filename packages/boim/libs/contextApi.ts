import React, { createContext, ReactElement } from "react";

interface route {
  path: string | null;
}

interface htmlState {
  context: {
    main: ReactElement | null;
    srcList: Array<string> | null;
  } | null;
}

interface headState {
  setHead: (headChildren: React.ReactNode) => void | null;
}

interface routeState {
  routeContext: {
    path: string | null;
  };
  setRouteContext: (router: route) => void | null;
}

export default class Context {
  static HtmlContext = createContext<htmlState>({
    context: {
      main: null,
      srcList: null,
    },
  });

  static HeadContext = createContext<headState>({
    setHead: function () {
      return null;
    },
  });

  static RouterContext = createContext<routeState>({
    routeContext: {
      path: "",
    },
    setRouteContext: null,
  });

  static HtmlProvider = this.HtmlContext.Provider;
  static HeadProvider = this.HeadContext.Provider;
  static RouterProvider = this.RouterContext.Provider;
}
