import { RENDERTYPE, RENDERPROPSTYPE } from "../common/constants";

interface FetchResult {
  renderType: string;
  renderProps: Props;
}

interface Props {
  props: Custom | object;
}

interface Custom {
  [key: string]: any;
}

export default class Fetch {
  static DEFAULT(): FetchResult {
    return {
      renderType: RENDERTYPE.ssg,
      renderProps: { props: {} },
    };
  }

  static async SSG(cb: any): Promise<FetchResult> {
    return {
      renderType: RENDERTYPE.ssg,
      renderProps: await cb(),
    };
  }

  static async SSR(cb: any): Promise<FetchResult> {
    return {
      renderType: RENDERTYPE.ssr,
      renderProps: await cb(),
    };
  }

  static async getProps(type: string, cb: any): Promise<FetchResult> {
    if (type === RENDERPROPSTYPE.ssg) {
      return await Fetch.SSG(cb);
    } else if (type === RENDERPROPSTYPE.ssr) {
      return await Fetch.SSR(cb);
    } else if (type === RENDERPROPSTYPE.default) {
      return Fetch.DEFAULT();
    }
  }
}
