/**
 * @jest-environment jsdom
 */
import React from "react";

import { render, screen } from "@testing-library/react";

import Route from "../pages/Route";

describe("Route Component render test", () => {
  function App({ Component }) {
    return <Component />;
  }

  function Page() {
    return <p>boim 페이지</p>;
  }

  test("Route Component render test", () => {
    const initialInfo = {
      _App: App,
      result: {},
      Component: Page,
      dynamicPathInfo: {},
    };

    render(<Route initialInfo={initialInfo} />);

    expect(screen.getByText("boim 페이지")).toBeTruthy();
  });
});
