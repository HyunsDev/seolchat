# 설챗(SeolChat)

![banner](https://user-images.githubusercontent.com/46562466/105068884-bb748e80-5ac4-11eb-8450-cf8227e1ffeb.png)


![스크린샷](https://user-images.githubusercontent.com/46562466/105063958-af3a0280-5abf-11eb-99ba-0a9fa1c9b09f.png)

설챗으로 우리만의 채팅방을 만들어보세요.

## 세팅

### 필요한 것들

1. Node.js
2. 텍스트 편집 툴 (VSC, 메모장...)
3. 아주 조금의 개발 능력
4. ~~귀여운 고양이~~

### 설치

1. 이 레포지토리를 적당한 곳에 clone 해주세요.
2. 설치한 위치에서 CMD/터미널 을 열고 `npm install` 명령을 실행해주세요.
3. 웹 브라우저를 열고 `localhost:3000`을 들어가서 잘 접속되는 지 확인해주세요.

### 사용자 추가

1. `config` 폴더 안에 `user.json` 파일을 열어주세요.

2. 새로운 사용자를 추가하고 싶으면 아래 양식에 맞춰 추가해주세요. ( 대괄호로 묶여있는 것들을 알맞게 수정해주세요. )
```
   "[이름]": {
        "nickname": "[이름]",
        "password": "[비밀번호]",
        "profile": "/base.png",
        "key": "",
        "color": "#ffffff"
    }
```
> 주의! 설챗은 비밀번호를 암호화 하지 않아요! 주의해서 사용해주세요.

3. 파일을 저장하고 웹사이트에서 `이름` 과 `비밀번호` 를 사용해서 로그인 해보세요.

### 프로필 사진 추가하기

설챗에서는 프로필 사진을 사용자가 직접 업로드 할 수는 없지만 미리 정해진 프로필 사진에서 고를 수 있어요. 사진을 추가하려면 아래 과정을 따라주세요.

1. 사진을 100px X 100px 사이트로 잘라주세요.
   * 자르지 않는 경우 로딩이 느려지거나 사진의 비율이 망가질 수 있어요.
2. 자른 사진을 `public/img/profile/nomal/` 폴더 안에 넣어주세요.
3. 채팅방 설정 > 프로필 사진 변경하기를 눌러서 사진이 잘 추가되었는지 확인하세요.

## 라이센스

설챗은 GPLv3 라이센스를 따릅니다.

이 웹사이트는 Font Awesome의 사진(arrow-left-solid.svg)을 사용하고 있습니다. - CC BY

## 도움

도움이 필요하다면 저에게 연락해주세요!

메일 : hyuns@hyuns.me

디스코드 : 혀느현스#3891
