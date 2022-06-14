import Fetch from "../libs/fetchApi";

describe("fetchApi test", () => {
  test("type test", () => {
    expect(typeof Fetch.DEFAULT).toBe("function");
    expect(typeof Fetch.SSG).toBe("function");
    expect(typeof Fetch.SSR).toBe("function");
    expect(typeof Fetch.getProps).toBe("function");
  });

  test("DEFAULT static method test", () => {
    const result = {
      renderType: "StaticSiteGeneration",
      renderProps: { props: {} },
    };

    expect(Fetch.DEFAULT()).toEqual(result);
  });

  test("SSG static method test", async () => {
    const result = {
      renderType: "StaticSiteGeneration",
      renderProps: {
        props: {
          boimData: "BOIM SSG CONTENT",
        },
      },
    };

    async function SSG() {
      return {
        props: {
          boimData: "BOIM SSG CONTENT",
        },
      };
    }

    const props = await Fetch.SSG(SSG);

    expect(props).toEqual(result);
  });

  test("SSR static method test", async () => {
    const result = {
      renderType: "ServerSideRendering",
      renderProps: {
        props: {
          boimData: "BOIM SSR CONTENT",
        },
      },
    };

    async function SSR() {
      return {
        props: {
          boimData: "BOIM SSR CONTENT",
        },
      };
    }

    const props = await Fetch.SSR(SSR);

    expect(props).toEqual(result);
  });

  test("getProps static method test", async () => {
    const ssrResult = {
      renderType: "ServerSideRendering",
      renderProps: {
        props: {
          boimData: "BOIM SSR CONTENT",
        },
      },
    };
    const ssgResult = {
      renderType: "StaticSiteGeneration",
      renderProps: {
        props: {
          boimData: "BOIM SSG CONTENT",
        },
      },
    };
    async function SSG() {
      return {
        props: {
          boimData: "BOIM SSG CONTENT",
        },
      };
    }

    async function SSR() {
      return {
        props: {
          boimData: "BOIM SSR CONTENT",
        },
      };
    }

    const ssgProps = await Fetch.getProps("SSG", SSG);
    const ssrProps = await Fetch.getProps("SSR", SSR);

    expect(ssgProps).toEqual(ssgResult);
    expect(ssrProps).toEqual(ssrResult);
  });
});
