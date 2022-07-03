<p align="center">
  <a href="https://boim-documentation.herokuapp.com">
    <img width="100" alt="logo" src="https://user-images.githubusercontent.com/54696956/176232689-526bc046-3ddc-47d4-8eac-ce8426383541.png">
  </a>
</p>

<br/>

## Documentation: [공식문서](https://boim-documentation.herokuapp.com/)
공식문서에서 시작 방법 및 사용 방법을 확인할 수 있습니다.

<br/>

## Motivation
개발을 공부하고 시작하며 우리는 다른 개발자가 만든 좋은 언어, 프레임워크, 라이브러리를 사용하였고
이를 바탕으로 프로젝트를 진행하고 무엇인가 만들 수 있었습니다. 그리고 당연하게도 현재 시장에서 많은 개발의 결과물로 수많은 가치가 창출되고 있습니다.
grimer팀은 개발을 진행할 수 있는 프레임워크를 만들어 우리가 받은 도움을 나눠줄 수 있는 점, 이를 이용한 결과물의 공헌
또한 매우 뜻깊음에 공감했고
리액트를 공부하며 SPA의 단점인 SEO를 개선하고 서버사이드 렌더링을 쉽게 도와주는 Next.js을 참고하여 일부 기능을 가진 프레임워크를 만드는 프로젝트를 진행하게 되었습니다.

<br/>

## Introduction
리액트 서버사이드 렌더링 + 클라이언트 사이드 렌더링 , 디렉토리 구조를 이용한 라우팅을 제공하는 프레임워크 입니다.

<br/>

## Tech
React , React-Dom , Type-script , Jest , Express , Webpack , CI/CD(Github), Etc...

<br/>

## File distructure
<details>
  <summary>파일 구조 상세 설명</summary>

  boim  
 ┣ bin  
 ┃ ┗ script.js: "package.json scripts command loginc"  
 ┣ common  
 ┃ ┗ constants.ts  
 ┣ config  
 ┃ ┣ fetchPolyfill.js  
 ┃ ┣ runner.js: "common webpack config"  
 ┃ ┣ webpack.asset.config.js: "client public asset webpack config"  
 ┃ ┣ webpack.dev.config.js: "dev mode webpack config"  
 ┃ ┣ webpack.dynamic.config.js: "dynamic routing webpack config"  
 ┃ ┣ webpack.hydration.config.js: "server side rendering, server side generation webpack config"  
 ┃ ┣ webpack.lib.config.js: "directoryApi, searchApi webpack config"  
 ┃ ┗ webpack.prod.config.js: "prod mode webpack config"  
 ┣ libs  
 ┃ ┣ contextApi.ts: "HtmlContext, HeadContext, RouteContext define"  
 ┃ ┣ directoryApi.ts: "get filepath, generate hydrate.js, generate webpack entry, etc..."  
 ┃ ┣ documentApi.ts: "Html head tag custom logic". 
 ┃ ┣ fetchApi.ts: "SSR(server side rendering), SSG(server side generation) logic"  
 ┃ ┣ historyApi.ts: "history library(createBrowserHistory)"  
 ┃ ┣ pathAlias.ts: "client path, boim path define"  
 ┃ ┗ searchApi.ts: "check custom _app,_document, get filepath from manifest, etc..."  
 ┣ pages  
 ┃ ┣ templates  
 ┃ ┃ ┗ htmlTemplate.tsx: "rendering Html logic"  
 ┃ ┣ Link.tsx: "client side rendering component(similar a(Html Element) tag)"  
 ┃ ┣ Route.tsx: "client side rendering component(similar react-router-dom)"  
 ┃ ┣ _app.tsx: "custom global css"  
 ┃ ┣ _document.tsx: "custom global layout"  
 ┃ ┣ _error.tsx: "default error component"  
 ┃ ┗ useRouter.tsx: "route hook(similar react useHistory, useLocation)"  
 ┣ server  
 ┃ ┣ _dev.js: "development mode express server"  
 ┃ ┣ _www.ts: "production mode express server (includes: controller, express, loader, route)"  
 ┃ ┣ controller.ts  
 ┃ ┣ express.ts  
 ┃ ┣ loader.ts  
 ┃ ┗ route.ts  
</details>


<br/>

## Schedule
### 개발 기간: 4주 (2022.06.01 ~ 2022.06.29)

### 1주차 (06/01 ~ 06/08)
- 아이디어 선정
- Next.js 학습
- 칸반 작성
- 기술 조사
- Git Repository 생성
- Git Action
<br/>

### 2주차 (06/08 ~ 06/15)
- 서버 사이드 렌더링 기본 로직
- 개발 관련 config 설정
- _app, _document 개발
<br/>

### 3주차 (06/15 ~ 06/22)
- 클라이언트 사이드 렌더링 기본 로직
- webpack 수정
- Route, useRouter 구현
- cache 설정
<br/>

### 4주차 (06/22 ~ 06/29)
- Head 컴포넌트
- dynamic Routing 개발
- Link 컴포넌트 개발
- Error 핸들링
- Development 모드
- 배포 , docs 사이트 작성
- 리팩토링

<br/>


## Challenge & Issue


### Head Component
Boim 프레임워크에서는 사용자가 각 페이지(React Component)를 생성하게 된다면 각 페이지마다 검색 엔진 최적화(SEO) 기능을 제공하고자 하였습니다.

검색 엔진 최적화(SEO)를 하기 위헤서는 ```<head>``` 태그를 수정이 가능하도록 만드는것이였고, 예를 들어 검색 엔진이 웹페이지를 읽을 때 가장 먼저 읽는 내용인 ```<title>``` 태그나 웹페이지의 요약 설명이 포함되어 있어 검색자가 찾고자하는 내용을 포함하고 있는지 판단하는데 도움을 주는 ```<meta>``` 태그를 수정 할 수 있도록 하는것이였습니다.

그래서 아래와 같이 ```<Head>``` 컴포넌트를 제공하여 각 페이지(리액트 컴포넌트)마다 head 태그를 수정할 수도록 하였습니다.

```jsx
function Home() {
  return (
    <>
      <Head>
        <title>"Boim"<title>
      </Head>
      <p>
        "Boim" 사이트에 오신걸 환영합니다.
      </p>
    </>
  );
}
```

```<Head>``` 컴포넌트를 구현함에 있어서 각 페이지(React Component)는 ```<body>``` 태그 내부에서 렌더링 되는 구조로 되어 있어서 ```<Head>``` 컴포넌트로 전달되어지는 children 요소를 React Context 를 이용하여 각 ```<head>``` 관련 태그들을 관리하여 사용했습니다.

서버사이드 렌더링측 에서는 각 ```<Head>``` 컴포넌트를 사용하여 Context로 관리되고 있는 ```<head>``` 관련 태그들을 문자열로 변환하여 해당 문자열을 html 파일에 wrtie 하여 html 파일을 반환하여 구현 하였습니다.

그리고 클라이언트 사이트 렌더링 측에서는 리액트 렌더링은 현재 ```<body>``` 태그 내부에서 발생 하므로 ```<body>``` 태그 외부에 있는 ```<head>``` 태그를 조작하기 위해서는 DOM 요소를 직접 조작하는 방법을 선택하였습니다. ```<Head>``` 컴포넌트 children 요소로 전달되어진 앨리먼트(ex) title, meta .. tag)는 "React Element" 이기 때문에 해당 엘리먼트들을 배열의 요소로 관리 되고 있고 해당 배열에 할당 되어지는 모든 요소(리액트 엘리먼트)들을 문자열로 파싱하고 해당 문자열을 모두 연결하고 다시 "HTML Element"로 파싱하여 DOM 요소에 추가하였습니다.

그리고 다른 페이지로 이동시 이전 페이지의 head 태그 요소들을 남아 있는 상황이 발생 하여서 ```<Head>``` 컴포넌트 내부로직 "Set"과 "useEffect"를 사용하여 이전 "head" 요소들을 제거를 해주었습니다.
```jsx
const Head: React.FC<Props> = ({ children }) => {
  const { setHead, headInstance } = useContext(HeadContext);

  (...중략...)

  useEffect(() => {
    headInstance.add(children);
    setHead([...headInstance]);

    return () => {
      headInstance.delete(children);
      setHead([...headInstance]);
    };
  });

  return null;
};
```
<br/>

### Client Side Rendring (Route)
각 페이지를 처음 로드할 때에는 "서버 사이드 렌더링"으로 되지만 그 이후 페이지 이동시에 useRouter 함수나 Link 컴포넌트를 사용한다면 "클라이언트 사이드 렌더링"으로 동작하도록 구현하고자 하였습니다

"클라이언트 사이드 렌더링"을 구현하기 위해서 "React Router"와 같은 Route 기능이 필요하여 라우팅 history를 쉽게 관리할 수 있도록 도와주는 "history" 라이브러리와 해당 Route 관련 정보를 관리하기 위해 React "Context"를 사용하여 Route 컴포넌트를 구현하였습니다.

구현된 Route 컴포넌트를 간단하게 요약하면 아래와 같은 구조로 되어 있으며 각 페이지(리액트 컴포넌트)는 ```<RouteProvider>``` 로 wrapping 되어 있기 때문에 각 페이지에서 useRouter나 Link를 사용하여 이동할 "path"정보를 할당하게 되면 RouterProvider로 인하여 라우팅 정보를 쉽게 관리 할 수 있었습니다.

그리고 각 라우터관련 정보들을 상태로 관리하다보니 리렌더링이 자주 일어나는 상황이 발생하여서 사용자가 생성한 페이지(리액트 엘리먼트)에도 불필요한 리렌더링이 일어나 각 페이지를 Memoized(```<MemoedPage>```) 하여 불필요한 리렌더링을 방지 하였습니다.

```jsx

function Route(props) {
  (...중략...)

  return (
    <RouteProvider value={routerContextValue}>
      <MemoedPage componentInfo={componentInfo} />
    </RouteProvider>
  );
}
```

그리고 "history" 라이브러리를 사용하여 아래와 같이 ```history.push```함수를 사용하면 모든 이벤트가 ```history.listen``` 함수로 전달되기 때문에 라우팅 처리 관련 로직을 한곳에서 관리 하도록 하였습니다. 
```jsx

function Route(props) {
  (...중략...)

  useEffect(() => {
    const unlisten: () => void = history.listen(({ location }) => {
      (...생략...)
    });

    return () => {
      unlisten();
    };

  }, []);

  (...중략...)
}
```

현재는 ```require(`../../../pages${path}`)``` 와 같이 페이지 폴더 하위에 있는 모든 파일들을 미리 가져와서 해당 라우팅할 "path" 를 경로에 할당하여 동적 require 방식으로 구현되어 있어 라우팅하지 않는 파일들도 모두 가져와지는 상황입니다. 그래서 라우팅 처리할 페이지만 가져와 사용할 수 있도록 추후에 보완할 예정입니다.

</br>

### Development Mode
development mode 작업의 시작은 웹팩을 익히며 알아본 devServer를 통해 어렵지 않게 처리할 수 있을 것이라고 생각했습니다.

그렇지만 서버 사이드 렌더링과 동시에 프레임워크 내의 SSR(nextjs의 getServerSideProps), SSG(nextjs의 getStaticProps)의 data fetching 그리고 dynamic routing파일의 대응한 각각의 html을 생성해 반환하고 결과적으로 개발자의 코드수정을 인식해 수동으로 빌드하지 않고 브라우저에서 바로 확인할 수 있도록 해야하는 해당 작업은 좋은 개요나 출발점이 없었습니다.

결과적으로 devServer는 우리가 만든 백엔드로직을 수행하지 못하고 서버를 구성하기 때문에 사용하지 않았습니다.
방법을 조사하던 중 웹팩으로 빌드한 정적파일을 처리하는 익스프레스 스타일 미들웨어인 webpack-dev-middleware의 사용을 결정했습니다. 우리의 서버로직에 미들웨어로 적용할 수 있기 때문입니다.

개발모드로 사용하기 때문에 따로 번들링하지 않는 _dev.js(서버)를 만들어 사용했으며 동적라우팅, 정적라우팅파일을 감시하고 반영시키기 위해 각각 미들웨어를 생성해 적용했습니다.

node_modules에서 설치한 라이브러리를 가져와 사용할 수 있고 추가적인 파일을 생성하지 않는 장점이 있습니다.
번들링을 하였다면 굳이 해당 장점을 사용하지 않으며 위와 같은 동작을 위해 또 다른 config를 설정해야 하는 일이 발생하는 점도 작업결과의 이유입니다.

<br/>

### CBA(create-boim-app)와 CRA(create-react-app) 비교

##### Chrome lighthouse를 이용해 create-boim-app의 기본 제공 컴포넌트를 create-react-app과 비교한 결과 입니다.

<img width="1200" height="320" alt="create-boim-app, create-react-app 비교" src="https://user-images.githubusercontent.com/78071591/176712511-d42a64a0-dc16-4bc0-8f66-8249441b5861.png">

<br/>

##### setState 10개와 약 150개의 고정된 `<p>`태그 단일페이지 비교 결과입니다.

<img width="1200" height="280" alt="create-boim-app, create-react-app 비교" src="https://user-images.githubusercontent.com/78071591/176725946-7105d575-86f0-44cf-9c0f-c41efe08bd0b.png">

<br/>

* `First Contentful Paint`: 브라우저가 첫 번째 DOM의 콘텐츠 렌더링에 걸리는 시간

* `Time To Interactive`: 웹페이지가 완전한 상호작용까지 걸리는 시간

* `Speed Index`: 웹 페이지를 불러올 때, 콘텐츠가 시각적으로 표시되는 데까지 걸리는 시간

* `Total Blocking Time`: 웹 페이지가 사용자 입력에 응답하지 못하도록 차단된 총 시간

* `Largest Contentful Paint`: 뷰포트에서 가장 큰 콘텐츠 요소가 화면에 렌더링 될 때까지 걸리는 시간

* `Cumulative Layout Shift`: 이미지/광고의 느린 로딩, 비동기 동작, 동적 DOM 변경 등으로 웹 페이지의 레이아웃이 얼마나 변하는 지 측정한 값

<br/>

첫 비교에서 Largest Contentful Paint, Time To Interactive, Total Blocking Time 등이 소폭 차이 났으나 두 번째비교에서 First Contentful Paint, Time To Interactive, Largest Contentful Paint 는 3배 빠른속도를 보였고 Speed Index는 react 5초 대비 0.2초로 가장 큰 차이점을 보였습니다.

서버에서 Markup을 하고 브라우저에서 CSS, Script만 적용하는 점이 CSR로만 이루어진 CRA와 어떠한 차이점이 존재하게 되는지 눈으로 직접 확인할 수 있던 좋은 기회였고
`<!DOCTYPE html>`, `<meta>`태그 같은 자칫하면 놓칠 수 있는 부분 또한 수치와 직결되는 점을 알게 되었습니다.

프로젝트 결과물로 위와 같은 비교를 해볼 수 있는 점은 매우 뿌듯한 개발경험으로 생각합니다.
이번 프로젝트를 통해 개발경험, 사용자 경험의 중요성에 대해서도 몸소 느낄 수 있었으며 많은 부분 부족함을 가진 프로젝트이지만 팀원 모두 큰 도전의식을 가지고 시작했던 프로젝트이기에 더더욱 기능 하나하나 팀원과 협력하고 서로의 생각을 공유해서 문제해결에 집중했기에 마무리 할 수 있었습니다.

<br/>

### 타입 스크립트
프레임워크를 구현해야 했기에 개발 시 타입을 명확히 정의하고, 프레임워크를 사용하는 사용자 측에서도 어떤 인풋이 들어오고 아웃풋이 나가는지, 해당 변수에는 어떤 데이터가 들어가야 하는지 정확한 정보를 전달하기 위해 처음 TypeScript를 도입하였습니다.

또한 매일 칸반 보드의 테스크 카드 하나씩을 맡아서 작업을 진행하는 방식으로 테스크를 관리하였는데, 테스크 진행과정에서 명시적인 타입 설정은 코드를 이해하고 소통하는데 많은 도움이 되었다고 생각합니다. 다양한 장점이 있었기에 TypeScript를 도입하였지만, 원하는 코드에 TypeScript를 제대로 사용하기에는 부족한 점이 많았습니다. React/clinet, React/server, node(express) 환경을 모두 제어해야 하는 프로젝트 특성상 쉽게 디버깅할 수 없는 TypeScript 오류가 많이 발생하여 시간이 많이 소요되었습니다.

브라우저 그리고 Node.js는 TypeScript를 이해할 수 없기 때문에 TypeScript 코드를 transpiling 해주어야 하는데, 이런 과정도 모두 렌더링 전에 이뤄져야 하기 때문에 과정을 간소화시키고 최종 번들 시간을 줄여 빠르게 자원을 응답하는 작업을 깊게 다루지 못한 것 같아 아쉬움이 남기도 합니다. future plan으로 TypeScript를 더욱 깊게 이해하고 활용할 수 있도록 학습하여 조금 더 좋은 성능의 프레임워크를 만드는 일을 목표로 더 공부해보고 싶습니다.

<br/>

### CI / 테스트 코드
github action을 사용하여 처음으로 CI(Continuous Intergration)를 도입하였습니다. 지속적인 통합을 통해 전체적인 테스트를 매번 진행할 수 있었습니다. 또한 통합 후에 바로바로 흐름의 오류라던지, 조금 더 개선할 방법 등을 발견하고 팀원들과 함께 논의할 수 있었고, 빠르게 고쳐나갈 수 있었습니다.

하나의 기능 완성이 끝나면 자동으로 테스트를 구동하여 테스트가 통과할 경우만 PR이 생성되도록 흐름을 구성하였고, github action에서 테스트가 진행되는 동안 병렬적으로 다른 작업을 처리할 수 있어서 효율적인 작업 흐름을 가져갈 수 있었다고 생각합니다.

CI를 적용하기 위해 TTD(Test Driven Development) 방법론을 적용하여 프로젝트를 진행해보았습니다. TDD를 주안점으로 잡고 프로젝트를 진행했으나, 프레임워크를 구현하는 프로젝트를 처음 기획 및 개발해보기도 했고 기능을 예측하고 테스트를 먼저 작성하는 것이 어려웠기에 테스트를 먼저 작성하지 못한 부분도 많았습니다.

하지만 어느 정도 윤곽이 잡힌 로직을 만들고, 유닛 테스트 코드를 추가하여 볼륨을 넓혀나갈 때 지속적으로 테스트를 실행하여 추가한 로직이 잘 실행되고 있는지, 추가한 로직으로 인해 다른 코드에 오류가 생기는 일은 없는지 체크하면서 작업을 이어나갔습니다.

완벽하진 못했지만 테스트를 염두하며 프로젝트를 진행해보면서 테스트의 장점을 직접 느낄 수 있었고, CI와 함께 구성하여 효율적인 프로젝트를 만들 수 있었습니다.

<br/>

### hydrationRoot 에러
React로 Server Side Rendering을 구현할 수 있긴 하지만 방법이 꽤나 복잡하고 많은 작업을 추가해야 하므로 React의 단점을 보완하여 각 페이지의 목적에 맞게 다양한 렌더링 방식을 지원하는 프레임워크를 구현해보고 싶어 boim 프로젝트를 기획하게 되었습니다.

React 18 버전이 release 되었고, 발 빠르게 18 버전에 맞춰 프로젝트를 구상하고 작업을 시작했지만, React 구조적인 문제로 인해 17 버전으로 downgrade 하여 다시 재구성하였습니다. 해당 경험을 풀어내기 앞서, 사전에 프로젝트에 대한 이해가 필요하므로 내용을 먼저 정리하고 넘어가도록 하겠습니다.

- 전체적인 구조 설명

  Client Side Rendering은 root div만 존재하고, root 아래 주입될 번들된 js를 불러와 컴포넌트만 변경하여 DOM을 렌더링 합니다. 반면, Server Side Rendering은 미리 html을 생성하여 필요한 자원(css, js, png 등)을 html 태그에 주입해서 반환하고 브라우저에서는 html이 모두 그려진 화면을 렌더링 합니다.
각각의 렌더링 방식은 장단점이 존재하는데, 서로 보완하여 더 나은 사용자 경험을 제공하기 위해 Boim.js는 첫 렌더링 시 html을 생성하여 해당 html을 반환하고, Link 태그나 useRouter를 사용해 페이지 이동시 Client Side Rendering 방식으로 화면을 전환하여 깜빡임 없이 페이지를 전환할 수 있도록 합니다.
참고로, HTML string만 생성하여 파일 대신 string만 응답할 수도 있으나 사용자가 같은 요청을 보냈을 경우 동일한 로직이 실행되지 않고 캐싱된 자원을 활용할 수 있도록 HTML 파일을 생성해주었습니다.
Server Side Rendering으로 초기 정적인 HTML이 만들어지기 때문에 페이지 이동이라든지, interection에 의한 로직 실행 등 기존 마크업에 이벤트 리스너를 연결하는 핸들러 로직이 담긴 js를 주입하여 동적인 요소를 추가해주어야 합니다.
각 컴포넌트로 생성된 정적인 HTML과 함께 사용될 js 코드를 생성하기 위해 ReactDOM의 hydrate를 사용하여 동적인 웹사이트를 렌더링 할 수 있게 됩니다. 따라서 사용자가 작성한 컴포넌트를 hyrate 한 js 파일과, 컴포넌트를 HTML로 만들어 정적인 html 파일을 만들어 html 파일에 sciprt로 js를 주입해주었습니다.
이때 js를 생성할 수 있도록 ReactDOM은 API를 제공합니다. React 18 버전에서는 hydrationRoot API를 제공하여 해당 작업을 쉽게 할 수 있도록 지원해주었고, 해당 API를 사용하여 코드를 구성하였습니다.

- 문제 발견 및 해결

  hydrationRoot 사용 시, React 초기 UI와 서버에서 렌더링 된 것이 일치하지 않기 때문에 `Hydration failed because the initial UI does not match what was rendered on the server` 해당 에러가 발생하였습니다.
서칭 결과 React 18 버전에서 에러가 발생하지만 17 버전에서는 문제가 되지 않는다는 내용을 발견하였고, 테스트로 17 버전의 hydrate를 적용하였더니 에러가 사라졌습니다. 조금 더 자세히 살펴보니, Next.js에서 흔히 발생하는 문제이고 사용자가 특정 로직을 추가하여 에러를 없애는 여러 가지 방법이 있었습니다. 하지만 사용자가 에러를 찾아 코드로 직접 해결하게 하는 것보단 안정적으로 프레임워크를 제공하는 것이 맞다고 생각했기에 React 버전을 낮추고 해당 이슈를 해결하는 방법을 선택하게 되었습니다.

</br>

### script 명령어 이슈
node, commander등을 이용하여 작성한 boim-runner라는 create-boim-app에서 사용하는 script명령어 관련 npm 패키지를 배포하여 로컬에서의 동작을 확인하고 Heroku를 이용하여 boim 공식문서를 배포하는 도중 script 명령로직이 동작하지 않는 현상을 발견했고 node, npm 버전의 문제인지 확인한 결과 이상이 없었습니다.    
에러 로그도 표시되지 않아 원일을 정확히 알 수 없어 방식의 수정이나 로직의 수정도 여러번 거쳤으나 동일하게 동작하지 않는 증상이 반복되어 package.json의 script명령어를 cd node_modules/boim && npm run build 의 형식으로 작성하게 되었습니다.
