import { useContext } from "react";

import Context from "../libs/contextApi";

const { RouterContext } = Context;

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

export function useRouter(): RouteState {
  return useContext(RouterContext);
}
