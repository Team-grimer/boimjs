import dotenv from "dotenv";
import express, { Express } from "express";
import serveStatic from "serve-static";

import pageRouter from "./route";
import pathAlias from "../libs/pathAlias";
import { getHTML, renderToErrorPage } from "../pages/templates/htmlTemplate";
import Error from "../pages/_error";

dotenv.config();

export default function (): Express {
  const app: Express = express();
  const options: serveStatic.ServeStaticOptions<
    express.Response<unknown, Record<string, unknown>>
  > = {
    maxAge: "31557600",
    setHeaders: function (res) {
      res.set("Cache-Control", "public, must-revalidate");
    },
  };

  app.use("/", pageRouter);
  app.use(express.static(`${pathAlias.client}/dist/pages`, options));
  app.use(express.static(`${pathAlias.client}/dist`, options));

  app.use((err, req, res, next) => {
    res.statusCode = res.statusCode && 500;

    const errorPage: string = renderToErrorPage(Error, {
      renderProps: {
        props: {
          title: err.message,
          statusCode: res.statusCode,
        },
      },
    });

    console.warn(err.message);
    res.send(errorPage);

    return;
  });

  return app;
}
