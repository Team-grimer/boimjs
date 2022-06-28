import React, { ReactElement, useContext } from "react";

import Context from "../libs/contextApi";

const { RouterContext } = Context;

type Href = {
  path: string;
  query: { [key: string]: string };
};

type ChildProps = {
  href: string;
  onClick: (event: React.MouseEvent) => void;
};

function createPropError(args: {
  key: string;
  expected: string;
  actual: string;
}) {
  return new Error(
    `Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.`
  );
}

function resolvedHref(href: Href): string {
  if (typeof href === "object") {
    if (!href["path"]) {
      throw new Error("Link component href props required path key");
    }
  }

  if (typeof href === "string") {
    return href;
  }

  if (typeof href === "object" && !Array.isArray(href)) {
    const { path, query }: Href = href;

    if (href["query"]) {
      let queryString = "?";
      Object.entries(query).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });

      if (queryString.lastIndexOf("&")) {
        queryString = queryString.substring(0, queryString.length - 1);
      }

      return path.concat(queryString);
    }

    return path;
  }
}

function clickLink(router, href, e): void {
  e.preventDefault();

  router.push(href, null);
}

export default function Link(props): ReactElement {
  const requiredProps = {
    href: true,
  };
  const optionalProps = {
    onClick: true,
  };

  Object.keys(requiredProps).forEach((key) => {
    if (key === "href") {
      if (
        props[key] === null ||
        (typeof props[key] !== "string" && typeof props[key] !== "object")
      ) {
        throw createPropError({
          key,
          expected: "`string` or `object`",
          actual: props[key] === null ? "null" : typeof props[key],
        });
      }
    }
  });
  Object.keys(optionalProps).forEach((key) => {
    const valType: string = typeof props[key];

    if (key === "onClick") {
      if (props[key] && valType !== "function") {
        throw createPropError({
          key,
          expected: "`function`",
          actual: valType,
        });
      }
    }
  });

  const { href: herfProp, children: childrenProp, onClick } = props;
  let children: React.ReactNode = childrenProp;
  let child: any;

  const href: string = resolvedHref(herfProp);

  if (typeof childrenProp === "string") {
    children = <a href={href}>{children}</a>;
  }

  try {
    child = React.Children.only(children);
  } catch (e) {
    throw new Error("Link Component can have only one component.");
  }

  const router = useContext(RouterContext);

  const childProps: ChildProps = {
    href,
    onClick: (e) => {
      if (typeof onClick === "function") {
        onClick(e);
      }

      if (child.props && typeof child.props.onClick === "function") {
        child.props.onClick(e);
      }

      clickLink(router, href, e);
    },
  };

  return React.cloneElement(child, childProps);
}
