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
      renderType: "StaticSiteGeneration",
      renderProps: { props: {} },
    };
  }

  static async SSG(cb: any): Promise<FetchResult> {
    return {
      renderType: "StaticSiteGeneration",
      renderProps: await cb(),
    };
  }

  static async SSR(cb: any): Promise<FetchResult> {
    return {
      renderType: "ServerSideRendering",
      renderProps: await cb(),
    };
  }

  static async getProps(type: string, cb: any): Promise<FetchResult> {
    if (type === "SSG") {
      return await Fetch.SSG(cb);
    } else if (type === "SSR") {
      return await Fetch.SSR(cb);
    } else if (type === "DEFAULT") {
      return Fetch.DEFAULT();
    }
  }
}
