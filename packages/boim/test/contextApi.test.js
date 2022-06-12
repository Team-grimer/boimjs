/**
 * @jest-environment jsdom
 */

import React, { useContext } from "react";

import { render, screen } from "@testing-library/react";

import Context from "../libs/contextApi";

describe.only("contextApi test", () => {
  test("provider test", () => {
    function Body() {
      return <div id="__boim">Context Test</div>;
    }

    function Content() {
      const { main } = useContext(Context.HtmlContext);
      return <div>{main}</div>;
    }

    function Page() {
      const props = {
        main: <Body />,
        srcList: [],
      };

      return (
        <Context.HtmlContext.Provider value={props}>
          <Content />
        </Context.HtmlContext.Provider>
      );
    }

    render(<Page />);

    expect(screen.getByText(/Context Test/i)).toBeTruthy();
  });
});
