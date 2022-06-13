import React, { createContext, ReactElement } from "react";

type State = {
  context: {
    main: ReactElement | null;
    srcList: Array<string> | null;
    head: React.ReactNode | null;
  } | null;
  setHead: (arg: React.ReactNode) => void | null;
};

export default class Context {
  static HtmlContext = createContext<State>({
    context: {
      main: null,
      head: null,
      srcList: null,
    },
    setHead: function () {},
  });

  static ContextProvider = this.HtmlContext.Provider;
}
