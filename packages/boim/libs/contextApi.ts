import React, { createContext, ReactElement } from "react";

interface HtmlState {
  context: {
    main: ReactElement | null;
    scriptList: Array<string> | null;
  } | null;
}

interface HeadState {
  cssList: Array<string> | null;
  headInstance: Set<unknown>;
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
      scriptList: null,
    },
  });

  static HeadContext: React.Context<HeadState> = createContext<HeadState>({
    cssList: null,
    headInstance: null,
    setHead: function () {
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

  static HtmlProvider = Context.HtmlContext.Provider;
  static HeadProvider = Context.HeadContext.Provider;
  static RouterProvider = Context.RouterContext.Provider;
}
