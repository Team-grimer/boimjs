import React, { createContext, ReactElement } from "react";

export interface HtmlState {
  context: {
    main: ReactElement;
    scriptList: Array<string> | null;
  };
  docComponentRendered: {
    [key: string]: boolean;
  };
}

export interface HeadState {
  cssList: Array<string> | null;
  headInstance: Set<any>;
  setHead: (headChildren: React.ReactChild | React.ReactChild[] | null) => void | null;
}

export interface RouteState {
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
    docComponentRendered: {
      Html: false,
      Main: false,
      Script: false,
      Head: false,
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
