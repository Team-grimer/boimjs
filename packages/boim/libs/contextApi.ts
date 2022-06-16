import React, { createContext, ReactElement } from "react";

interface HtmlState {
  context: {
    main: ReactElement | null;
    srcList: Array<string> | null;
  } | null;
}

interface HeadState {
  setHead: (headChildren: React.ReactNode) => void | null;
}

interface RouteState {
  push: (arg: string, state: { [key: string]: any }) => void | null;
  path: string;
  param: {
    [key: string]: any;
  };
  query: {
    [key: string]: string;
  };
}

export default class Context {
  static HtmlContext: React.Context<HtmlState> = createContext<HtmlState>({
    context: {
      main: null,
      srcList: null,
    },
  });

  static HeadContext: React.Context<HeadState> = createContext<HeadState>({
    setHead: () => {
      return null;
    },
  });

  static RouterContext: React.Context<RouteState> = createContext<RouteState>({
    push: () => {
      return null;
    },
    path: "",
    param: {},
    query: {},
  });

  static HtmlProvider = this.HtmlContext.Provider;
  static HeadProvider = this.HeadContext.Provider;
  static RouterProvider = this.RouterContext.Provider;
}
