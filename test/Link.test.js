/**
 * @jest-environment jsdom
 */

import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";

import Context from "../libs/contextApi";
import Link from "../pages/Link";

const { RouterProvider } = Context;

describe("Link Component", () => {
  test("Link component render test", () => {
    const mockPush = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link href="/boim">
            <a>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    expect(screen.getAllByText("boim 페이지")).toBeTruthy();
  });

  test("Link component call rotuer push method", () => {
    const mockPush = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link href="/boim">
            <a>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    const link = screen.getByText("boim 페이지");
    fireEvent.click(link);

    expect(mockPush).toBeCalledTimes(1);
  });

  test("Link component call rotuer push method with href string parameter", () => {
    const mockPush = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link href="/boim">
            <a>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    const link = screen.getByText("boim 페이지");
    fireEvent.click(link);

    expect(mockPush).toBeCalledWith("/boim", null);
  });

  test("Link component call rotuer push method with href object parameter", () => {
    const mockPush = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link href={{ path: "/boim", query: { name: "woo" } }}>
            <a>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    const link = screen.getByText("boim 페이지");
    fireEvent.click(link);

    expect(mockPush).toBeCalledWith("/boim?name=woo", null);
  });

  test("Link component call onClick method", () => {
    const mockPush = jest.fn();
    const mockOnClick = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link
            href={{ path: "/boim", query: { name: "woo" } }}
            onClick={mockOnClick}
          >
            <a>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    const link = screen.getByText("boim 페이지");
    fireEvent.click(link);

    expect(mockOnClick).toBeCalledTimes(1);
  });

  test("Link component call child component onClick method", () => {
    const mockPush = jest.fn();
    const mockChildOnClick = jest.fn();

    const routerContext = {
      push: mockPush,
      path: "",
      param: {},
      query: {},
    };

    function Page() {
      return (
        <div>
          <Link href={{ path: "/boim", query: { name: "woo" } }}>
            <a onClick={mockChildOnClick}>boim 페이지</a>
          </Link>
        </div>
      );
    }

    function Base() {
      return (
        <RouterProvider value={routerContext}>
          <Page />
        </RouterProvider>
      );
    }

    render(<Base />);

    const link = screen.getByText("boim 페이지");
    fireEvent.click(link);

    expect(mockChildOnClick).toBeCalledTimes(1);
  });
});
