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

// [V] build:client -> html, js 각각 1:1 생성 확인
// [V] html 생성, script 주입 확인
//    -> [V] 각각의 html 안에는 기본으로 <div id="boim"></div> 존재해야 한다.
//    -> [] 각각의 html 안에는 어떤 script가 있어야 하는가
//    -> [] div안에 컴포넌트의 react component jsx를 주입하는 시점은 
//          express에서 반환하기 직전이 적절한가

// [V] build:server -> server.js 생성(express on)
// [] pages 디렉토리 순회하여 모두 적용
// [] app.get router -> 요청 url에 대한 처리
