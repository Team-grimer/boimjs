/**
 * @jest-environment jsdom
 */

import React, { useContext } from "react";

import { render, screen } from "@testing-library/react";

import Context from "../libs/contextApi";

describe("contextApi test", () => {
  test("Html context provider test", () => {
    function Body() {
      return <div>Context Test</div>;
    }

    function Content() {
      const { context } = useContext(Context.HtmlContext);
      return <div>{context.main}</div>;
    }

    function Page() {
      const props = {
        context: {
          main: <Body />,
          cssList: [],
          scriptList: [],
          head: null,
        },
        setHead: null,
      };

      return (
        <Context.HtmlProvider value={props}>
          <Content />
        </Context.HtmlProvider>
      );
    }

    render(<Page />);

    expect(screen.getByText(/Context Test/i)).toBeTruthy();
  });

  test("Head context provider test", () => {
    const { HeadContext, HeadProvider } = Context;
    const mockSetHead = jest.fn();

    function MockHead({ children }) {
      const { setHead } = useContext(HeadContext);

      setHead(children);

      return null;
    }

    function Page() {
      const props = {
        cssList: null,
        headInstance: new Set(),
        setHead: mockSetHead,
      };

      return (
        <HeadProvider value={props}>
          <MockHead>
            <title>성공</title>
          </MockHead>
        </HeadProvider>
      );
    }

    render(<Page />);

    expect(mockSetHead).toBeCalledTimes(1);
  });

  test("Router context provider test", () => {
    const { RouterContext, RouterProvider } = Context;
    const mockPush = jest.fn();

    function Content() {
      const { push, path, param, query } = useContext(RouterContext);

      push("test", {});

      return (
        <>
          <p>{path}</p>
          <p>{param.name}</p>
          <p>{query.key}</p>
        </>
      );
    }

    const props = {
      push: mockPush,
      path: "/about",
      param: { name: "test" },
      query: { key: "value" },
    };

    function Route() {
      return (
        <RouterProvider value={props}>
          <Content />
        </RouterProvider>
      );
    }

    render(<Route />);

    expect(mockPush).toBeCalledTimes(1);
    expect(screen.getByText(props.path)).toBeTruthy();
    expect(screen.getByText(props.param.name)).toBeTruthy();
    expect(screen.getByText(props.query.key)).toBeTruthy();
  });
});
