import { RENDER_TYPE, RENDER_PROPS_TYPE } from "../common/constants";

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
      renderType: RENDER_TYPE.ssg,
      renderProps: { props: {} },
    };
  }

  static async SSG(cb: any): Promise<FetchResult> {
    return {
      renderType: RENDER_TYPE.ssg,
      renderProps: await cb(),
    };
  }

  static async SSR(cb: any): Promise<FetchResult> {
    return {
      renderType: RENDER_TYPE.ssr,
      renderProps: await cb(),
    };
  }

  static async getProps(type: string, cb: any): Promise<FetchResult> {
    if (type === RENDER_PROPS_TYPE.ssg) {
      return await Fetch.SSG(cb);
    } else if (type === RENDER_PROPS_TYPE.ssr) {
      return await Fetch.SSR(cb);
    } else if (type === RENDER_PROPS_TYPE.default) {
      return Fetch.DEFAULT();
    }
  }
}
