/**
 * @jest-environment jsdom
 */
import React from "react";

import PropTypes from "prop-types";
import { render, screen } from "@testing-library/react";

import App from "../pages/_app";

describe.only("_app component", () => {
  test("Component render test", () => {
    function TestComponent() {
      return <h1>TEST</h1>;
    }
    render(<App Component={TestComponent} pageProps={{ props: {} }} />);
    expect(screen.getByText("TEST")).toBeTruthy();
  });

  test("Component pageProps check test", () => {
    const props = {
      displayName: "success",
    };
    function TestComponent({ children, displayName }) {
      return (
        <>
          <h1>{displayName}</h1>
          <div>{children}</div>
        </>
      );
    }
    TestComponent.propTypes = {
      displayName: PropTypes.string,
      children: PropTypes.node,
    };

    render(<App Component={TestComponent} pageProps={{ props }} />);

    expect(screen.getByText(props.displayName)).toBeTruthy();
  });
});
