import React, { createContext, ReactElement } from "react";

interface route {
  path: string | null;
}

type htmlState = {
  context: {
    main: ReactElement | null;
    srcList: Array<string> | null;
  } | null;
};

type headState = {
  setHead: (headChildren: React.ReactNode) => void | null;
};

type routeState = {
  routeContext: {
    path: string | null;
  };
  setRouteContext: (router: route) => void | null;
};

export default class Context {
  static HtmlContext = createContext<htmlState>({
    context: {
      main: null,
      srcList: null,
    },
  });

  static HeadContext = createContext<headState>({
    setHead: function () {},
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
