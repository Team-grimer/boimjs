import React, { useState, useEffect, ReactElement } from "react";

import qs from "querystringify";
import reactElementToJSXString from "react-element-to-jsx-string";

import Context from "../libs/contextApi";
import Fetch from "../libs/fetchApi";
import History from "../libs/historyApi";
import Document from "../libs/documentApi";

interface Props {
  _App: React.ElementType;
  result: {
    [key: string]: any;
  };
  Component: ReactElement | React.FC;
  dynamicPathInfo: {
    [key: string]: Array<{ params: { [key: string]: string } }>;
  };
}

interface RouteProps {
  initialInfo: Props;
}

interface PageProps {
  componentInfo: Props;
}

interface PageHeadProps {
  headList: Array<ReactElement>;
}

interface RouteState {
  isSSR: boolean;
  path: string;
  param: {
    [key: string]: any;
  };
  query: {
    [key: string]: string;
  };
}

interface RenderInfo {
  routerContext: {
    push: (pathName: string, param: { [key: string]: any }) => void;
    path: string;
    param: {
      [key: string]: any;
    };
    query: {
      [key: string]: string;
    };
  };
  headContext: {
    cssList: Array<string>;
    headInstance: Set<unknown>;
    setHead: (headList: any) => void;
  };
  renderOption: Props;
}

const { RouterProvider, HeadProvider } = Context;
const { history } = History;

const defaultHeadTag = `<head><meta charSet="utf-8"></meta>
<meta name="viewport" content="width=device-width,initial-scale=1"></meta>
<title>Boim js</title></head>`;

const MemoedPage: React.FC<PageProps> = React.memo(Page);

function Page({ componentInfo }: PageProps): ReactElement {
  return (
    <componentInfo._App
      Component={componentInfo.Component}
      pageProps={componentInfo.result.renderProps}
    />
  );
}

function PageHead({ headList }: PageHeadProps): ReactElement {
  const DomParser: DOMParser = new DOMParser();

  const headElement: HTMLElement = document.querySelector("head");
  const defaultHeadElement: HTMLElement = DomParser.parseFromString(
    defaultHeadTag,
    "text/html"
  ).querySelector("head");

  const docuement: Document = new Document(headElement, defaultHeadElement);

  docuement.removeChildrenOfHeadElement();
  docuement.addDefaultHeadChildren();

  if (!headList.length) {
    return null;
  }

  const headElementList: Array<ReactElement> = headList.flat();
  const headTagString: string = headElementList
    .map((value) => {
      return reactElementToJSXString(value);
    })
    .join("");
  const customHeadDocument: HTMLElement = DomParser.parseFromString(
    headTagString,
    "text/html"
  ).querySelector("head");

  docuement.setElement("customHead", customHeadDocument);
  docuement.removeDuplicateHead();
  docuement.addCustomHeadChildren();

  return null;
}

const MemoedPageHead: React.FC<PageHeadProps> = React.memo(PageHead);

export default function Route({ initialInfo }: RouteProps): ReactElement {
  const [pageHeadList, setPageHeadList] = useState([]);
  const [dynamicInfo, setDynamicInfo] = useState({});

  const [routeStatus, setRouteStatus] = useState<RouteState>({
    isSSR: true,
    path: "",
    param: {},
    query: {},
  });

  const [renderInfo, setRenderInfo] = useState<RenderInfo>({
    routerContext: {
      push: (pathName, state) => {
        history.push(pathName, state);
      },
      path: "",
      param: {},
      query: {},
    },
    headContext: {
      cssList: null,
      headInstance: new Set(),
      setHead: (headList) => {
        setPageHeadList(headList);
      },
    },
    renderOption: {
      ...initialInfo,
    },
  });

  useEffect(() => {
    const result = {};

    async function setDynamicRoute() {
      for (const directoryPath of Object.keys(initialInfo.dynamicPathInfo)) {
        const dynamicComponent = require(`../../../../pages${directoryPath}/index.js`);
        const app = Object.assign({}, dynamicComponent);

        if (dynamicComponent.hasOwnProperty("PATHS")) {
          const { paths } = await app.PATHS();

          const key = directoryPath
            .split("/")
            .pop()
            .replace("[", "")
            .replace("]", "");

          paths.forEach((value) => {
            const paramKey: string = value.params[key];
            const outputKey: string = String(directoryPath).replace(
              `[${key}]`,
              paramKey
            );

            result[outputKey] = {
              path: directoryPath,
              param: value,
            };
          });
        }
      }

      setDynamicInfo(result);
    }

    setDynamicRoute();

    const unlisten: () => void = history.listen(({ location }) => {
      setRouteStatus({
        isSSR: false,
        path: location.pathname,
        param: location.state,
        query: qs.parse(location.search),
      });
    });

    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (routeStatus.isSSR) {
      return;
    }

    const isDynamicRouting: boolean = dynamicInfo.hasOwnProperty(
      routeStatus.path
    );
    const path: string = isDynamicRouting
      ? dynamicInfo[routeStatus.path].path
      : routeStatus.path;

    const client = require(`../../../../pages${path}`);
    const app = Object.assign({}, client);

    const Component: ReactElement = app["default"];
    const _App: React.ElementType = initialInfo._App;

    async function getComponentProps() {
      let result: {
        renderType: string;
        renderProps: { [key: string]: any };
      };

      if (isDynamicRouting) {
        const pageProps = await app.SSG(dynamicInfo[routeStatus.path].param);

        result = {
          renderType: "StaticSiteGeneration",
          renderProps: { props: pageProps.props },
        };
      } else {
        const type: string = app["SSG"]
          ? "SSG"
          : app["SSR"]
          ? "SSR"
          : "DEFAULT";
        result = await Fetch.getProps(type, app[type]);
      }

      setRenderInfo({
        routerContext: {
          ...renderInfo.routerContext,
          path: routeStatus.path,
          param: routeStatus.param,
          query: routeStatus.query,
        },
        headContext: {
          ...renderInfo.headContext,
        },
        renderOption: {
          ...renderInfo.renderOption,
          _App,
          result,
          Component,
        },
      });
    }

    getComponentProps();
  }, [routeStatus]);

  return (
    <>
      {!routeStatus.isSSR && <MemoedPageHead headList={pageHeadList} />}
      <RouterProvider value={renderInfo.routerContext}>
        <HeadProvider value={renderInfo.headContext}>
          <MemoedPage componentInfo={renderInfo.renderOption} />
        </HeadProvider>
      </RouterProvider>
    </>
  );
}
