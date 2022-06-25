import React from "react";

import { Head } from "./_document";

interface ErrorProps {
  title: string;
  statusCode: number;
}

const statusCodes: { [code: number]: string } = {
  404: "This page could not be found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

const Error: React.FC<ErrorProps> = ({ title, statusCode }) => {
  console.warn(title);
  return (
    <div style={styles.error}>
      <Head>
        <title>{`${statusCode} | ${statusCodes[statusCode]}`}</title>
      </Head>
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
                body { margin: 0; color: #000; background: #fff; }
                .boim-error-h1 {
                  border-right: 1px solid rgba(0, 0, 0, .3);
                }
                `,
          }}
        />
        {statusCode ? (
          <h1 className="boim-error-h1" style={styles.h1}>
            {statusCode}
          </h1>
        ) : null}

        <div style={styles.desc}>
          <h2 style={styles.h2}>{title}.</h2>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  error: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Roboto, \"Segoe UI\", \"Fira Sans\", Avenir, \"Helvetica Neue\", \"Lucida Grande\", sans-serif",
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  desc: {
    display: "inline-block",
    textAlign: "left",
    lineHeight: "49px",
    height: "49px",
    verticalAlign: "middle",
  },

  h1: {
    display: "inline-block",
    margin: 0,
    marginRight: "20px",
    padding: "10px 23px 10px 0",
    fontSize: "60px",
    fontWeight: 500,
    verticalAlign: "top",
  },

  h2: {
    fontSize: "40px",
    fontWeight: "normal",
    lineHeight: "inherit",
    margin: 0,
    padding: 0,
  },
};

export default Error;
