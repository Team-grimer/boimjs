import React, { useContext } from "react";

import Context from "../libs/contextApi";

const { RouterContext } = Context;

type href = {
  path: string;
  query: { [key: string]: string };
};

function verificationHref(href) {
  if (typeof href === "string") {
    return href;
  }

  if (typeof href === "object" && !Array.isArray(href)) {
    const { path, query }: href = href;

    let queryString = "?";
    Object.entries(query).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    return path.concat(queryString);
  }
}

function clickLink(router, href, e) {
  e.preventDefault();

  router.push(href, null);
}

export default function Link(props) {
  const { href: herfProp, children: childrenProp } = props;
  let children: React.ReactNode = childrenProp;
  let child;

  if (typeof childrenProp === "string") {
    children = <a>{children}</a>;
  }

  try {
    child = React.Children.only(children);
  } catch (e) {
    throw new Error("Link Component can have only one component.");
  }

  const router = useContext(RouterContext);

  const href = verificationHref(herfProp);

  const childProps = {
    href,
    onClick: (e) => {
      if (!e.defaultPrevented) {
        clickLink(router, href, e);
      }
    },
  };

  return React.cloneElement(child, childProps);
}
