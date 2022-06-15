import { useContext } from "react";

import Context from "../libs/contextApi";

export function useRouter() {
  const { setRouteContext } = useContext(Context.RouterContext);

  return {
    push: (path) => {
      setRouteContext({ path });
    },
  };
}
