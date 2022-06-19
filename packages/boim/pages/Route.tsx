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
  Component: ReactElement;
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

    const client = require(`../../../../pages${routeStatus.path}`);
    const app = {};

    Object.entries(client).forEach(([key, value]) => {
      app[key] = value;
    });

    const Component: ReactElement = app["default"];
    const type: string = app["SSG"] ? "SSG" : app["SSR"] ? "SSR" : "DEFAULT";

    const _App: React.ElementType = initialInfo._App;

    async function getComponentProps() {
      const result = await Fetch.getProps(type, app[type]);

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
