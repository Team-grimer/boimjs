import fs from "fs";
import path from "path";

import React from "react";

import dotenv from "dotenv";
import express from "express";
import ReactDOMServer from "react-dom/server";

import Home from "../../../../pages/Home";

dotenv.config();
const PORT = process.env.PORT || 3006;
const app = express();

app.get("/", (req, res) => {
  const app = ReactDOMServer.renderToPipeableStream(<Home />);
  let htmlFile = path.resolve("../../../dist/index.html");

  fs.readFile(htmlFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    htmlFile = data.replace('<div id="__boim"></div>', `<div id="__boim">${app}</div>`); 
    
    return res.send(htmlFile);
  });
});

app.use(express.static("../../../dist"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
