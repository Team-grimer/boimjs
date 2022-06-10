import { createContext, ReactElement } from "react";

type State = {
  main: ReactElement | null;
  srcList: Array<string> | null;
};

export default class Context {
  static HtmlContext = createContext<State>({
    main: null,
    srcList: [],
  });
}
