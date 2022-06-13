export default class Fetch {
  static DEFAULT() {
    return {
      renderType: "StaticSiteGeneration",
      renderProps: { props: {} },
    };
  }

  static async SSG(cb) {
    return {
      renderType: "StaticSiteGeneration",
      renderProps: await cb(),
    };
  }

  static async SSR(cb) {
    return {
      renderType: "ServerSideRendering",
      renderProps: await cb(),
    };
  }

  static async getProps(type, cb) {
    if (type === "SSG") {
      return await Fetch.SSG(cb);
    } else if (type === "SSR") {
      return await Fetch.SSR(cb);
    } else if (type === "DEFAULT") {
      return Fetch.DEFAULT();
    }
  }
}
