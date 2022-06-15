/**
 * @jest-environment jsdom
 */

import React, { useContext } from "react";

import { render, screen } from "@testing-library/react";

import Context from "../libs/contextApi";

describe("contextApi test", () => {
  test("provider test", () => {
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
          srcList: [],
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
});
