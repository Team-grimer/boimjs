/**
 * @jest-environment jsdom
 */
import React from "react";

import { render, screen, waitFor } from "@testing-library/react";

import Route from "../pages/Route";

describe("Route Component render test", () => {
  function App({ Component }) {
    return <Component />;
  }

  function Page() {
    return <p>boim 페이지</p>;
  }

  test("Route Component render test", async () => {
    const initialInfo = {
      _App: App,
      initialProps: {},
      Component: Page,
      dynamicPathInfo: {},
    };

    render(<Route initialInfo={initialInfo} />);

    await waitFor(() => expect(screen.getByText("boim 페이지")).toBeTruthy());
  });
});
