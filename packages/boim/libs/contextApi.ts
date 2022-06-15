import React, { createContext, ReactElement } from "react";

interface State {
  context: {
    main: ReactElement | null;
    cssList: Array<string> | null;
    scriptList: Array<string> | null;
    head: React.ReactNode | null;
  } | null;
  setHead: (arg: React.ReactNode) => void | null;
}

export default class Context {
  static HtmlContext = createContext<State>({
    context: {
      main: null,
      head: null,
      cssList: null,
      scriptList: null,
    },
    setHead: function () {
      return null;
    },
  });

  static ContextProvider = this.HtmlContext.Provider;
}
