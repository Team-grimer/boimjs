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
  // const fetchedComponent = _app();
  // const htmlNode = ReactDOMServer.renderToPipeableStream(<fetchedComponent />);
  const app = ReactDOMServer.renderToPipeableStream(<Home />);

  // build(project)된 html을 가져오는 경로
  const htmlFile = path.resolve(".././../../build/server/pages/index.html");

  // html -> div id="boim" -> component node(html) 주입
  fs.readFile(htmlFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace('<div id="boim"></div>', `<div id="boim">${app}</div>`)
    );
  });
});

// build(project)된 html을 제공하는 경로
app.use(express.static("../../../../build/server/pages"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// [V] build:client -> html, js 각각 1:1 생성 확인
// [] html 생성, script 주입확인
//    -> [V] 각각의 html 안에는 기본으로 <div id="boim"></div> 존재해야 한다.
//    -> [] 각각의 html 안에는 어떤 script가 있어야 하는가
//    -> [] div안에 컴포넌트의 jsx를 주입하는 시점은 express에서 반환하기 직전이 적절한가

// [] build:server -> bundleJS 생성(express on)
// [] pages 디렉토리 순회하여 모두 적용
// [] app.get router -> 요청 url에 대한 처리
