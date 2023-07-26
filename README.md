# Zoom (Challenge)

### JavaScript 만으로 채팅방 생성, 화상채팅, 개인 메시지를 구현합니다. Zoom Clone Challenge using NodeJS, WebRTC and Websockets.

#### [23-07-24 ~ 23-07-31(1주)] 챌린지 교육 과정.

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white"/> <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/Pug-A86454?style=flat-square&logo=pug&logoColor=white"/> <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white"/> <img src="https://img.shields.io/badge/Babel-F9DC3E?style=flat-square&logo=babel&logoColor=white"/>

---

- **23-07-25 : #0.0 ~ #1.9 / Initial Settings & Chat with WebSocket (+ Code Challenge(2 days)[2nd day])**
  - 초기 셋팅
    - 패키지: { nodemon, babel, express, pug }
      - .gitignore, nodemon.json, babel.config.json 생성 및 작성
    - Back-End
      - package.json에서 script 생성
      - 서버 파일(server.js) 및 Express 서버 생성
    - Front-End
      - JavaScript 파일 및 Express에서 static 설정
      - Express에서 Pug template 설정
      - nodemon.json에서 Front-End 파일 수정 시 자동 재시작 기능 제거
      - 간단한 CSS를 위해 'MVP.CSS' 적용
  - WebSocket
    - 서버와 사용자 사이에 양방향성 실시간 연결 protocol
    - 패키지: ws
      - Node.js용 WebSocket을 실행(implementation)하는 패키지
      - WebSocket의 기본적인 기능만 존재하므로, 부가적인 기능을 사용하려면 다른 framework 사용
      - 설정법: 따로 WS서버를 구축하지 않고, HTTP를 사용하는 Express를 그대로 사용하면서 구축
        1. Node.js에 내장되어있는 HTTP package를 사용해 HTTP서버 생성
        2. 생성한 HTTP서버에 접근 후, HTTP서버 위에 WS서버 생성
        - HTTP서버를 실행해, 두 서버 다 사용 가능 (같은 port를 공유하기 때문)
        - 각각 따로 서버를 만들거나, WS서버만 만들어도 무방함
    - WebSocket 연결(connection)
      - WS서버를 사용하므로, 다른 설치가 필요없이 브라우저에서 지원됨
        - 브라우저에서는 내장된 WebSocket API 존재
      - (필수) Front-End에서 Back-End로 WS 연결을 만들어야 함
        - 기본형: new WebSocket(host주소 [, 프로토콜]);
          - ex: const frontSocket = new WebSocket(\`ws://${window.location.host}\`);
      - (선택) Back-End에서 WS서버에 누가 연결했는지 알 수 있음
        - 기본형: WS서버.on(이벤트명, 콜백함수)
          - 콜백함수의 매개변수로 'socket'을 지원함
    - WebSocket Event
      - Front-End: '.addEventListener()' 사용
      - Back-End: '.on(이벤트명, 콜백함수)' 사용
    - WebSocket Message 보내기/받기
      - Front-End: 소켓.send(데이터) / 소켓.addEventListener("message", (message) => {... message.data ...});
      - Back-End: 소켓.send(데이터) / 소켓.on("message", (message) => {... message ...});
  - 실시간 채팅방
    - 메시지: 기능은 브라우저마다 독립적으로 작동
      1. template에서 form 생성
      2. Front에서 Back으로 메시지를 전송
      3. Back에서 Front로 받은 메시지를 전송
      4. Front에서 메시지를 받은 후, element를 생성해 document 화면에 보여줌
    - 온라인
      - 서버에서 누가 연결되어있는지 알기위해 'fake DB'(Array) 사용
      1. 브라우저가 WS서버와 연결 시 socket을 DB list에 넣음
      2. Back-End가 메시지를 받을 시 연결되어있는 모든 브라우저에게 메시지를 전송
      - '.forEach()'를 사용해 DB list에 있는 모든 socket에게 발송
    - 여러 개의 메시지를 한 번에 전송
      - WS는 한 번에 하나의 메시지(String 타입)만 발신/수신 가능
        - JavaScript 객체 사용 불가능
        - JSON을 이용해 문자열로 변환
      - 메시지 발신
        - JSON.stringify(): JS 객체 -> JSON 문자열
        - JSON 문자열로 변환 후, 메시지 전송
      - 메시지 수신
        - JSON.parse(): JSON 문자열 -> JS 객체
        - JS 객체로 변환 후, 조건문을 사용해 메시지의 용도를 구분
      - 닉네임 설정: socket은 객체이기 때문에 프로퍼티를 추가해 사용
- **23-07-26 : #2.0 ~ #2.3 / (+ Code Challenge(2 days)[1st day])**
- **23-07-27 : #2.4 ~ #2.11 / (+ Code Challenge(2 days)[2nd day])**

---

- **23-07-28 : #3.1 ~ #3.12 / (+ Code Challenge(3 days)[1st day])**
- **23-07-29 : #3.1 ~ #3.12 / (+ Code Challenge(3 days)[2nd day])**
- **23-07-30 : #3.1 ~ #3.12 / (+ Code Challenge(3 days)[3rd day])**
