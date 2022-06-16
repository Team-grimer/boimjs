import React, { createContext, ReactElement } from "react";

interface route {
  path: string | null;
}

interface htmlState {
  context: {
    main: ReactElement | null;
    scriptList: Array<string> | null;
  } | null;
}

interface headState {
  cssList: Array<string> | null;
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
      scriptList: null,
    },
  });

  static HeadContext = createContext<headState>({
    cssList: null,
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

  static HtmlProvider = Context.HtmlContext.Provider;
  static HeadProvider = Context.HeadContext.Provider;
  static RouterProvider = Context.RouterContext.Provider;
}
