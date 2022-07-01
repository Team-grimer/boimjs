interface Constants {
  [key: string]: string
}

export const EXT: Constants = {
  js: ".js",
  jsx: ".jsx",
  ts: ".ts",
  tsx: ".tsx",
  css: ".css",
  less: ".less",
  sass: ".sass",
  scss: ".scss",
  moduleCss: ".module.css",
  svg: ".svg",
  png: ".png",
  gif: ".gif",
  text: ".text",
  txt: ".txt",
  jpg: ".jpg",
  jpeg: ".jpeg",
};

export const RENDER_TYPE: Constants = {
  ssg: "StaticSiteGeneration",
  ssr: "ServerSideRendering",
};

export const RENDER_PROPS_TYPE: Constants = {
  ssg: "SSG",
  ssr: "SSR",
  default: "DEFAULT"
};

export const BASE_COMPONENT: Constants = {
  _app: "_app",
  _document: "_document"
};

export const DEFAULT_HEAD_TAG = `<head><meta charSet="utf-8"></meta>
<meta name="viewport" content="width=device-width,initial-scale=1"></meta>
<meta name="description" content="Web site created using create-boim-app"></meta>
<title>Boim js</title></head>`;
