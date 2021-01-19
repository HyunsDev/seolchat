# Clinet

## 변수

| Name      | Info                    | Type   |
| --------- | ----------------------- | ------ |
| userName  | 유저 이름               | str    |
| userKey   | 유저 인증키             | str    |
| chat_Info | 모든 유저 정보          | object |
| user_list | 현재 활동중인 유저 이름 | list   |

# API

## 주요 메소드

| METHOD   | NAME            |
| -------- | --------------- |
| name     | 사용자 이름     |
| password | 사용자 비밀번호 |
| key      | 사용자 인증키   |



## 주소

| Link               | Method | Data                    | Info                        |
| ------------------ | ------ | ----------------------- | --------------------------- |
| /api/login         | post   | name, password          | 로그인 요청                 |
| /api/check         | get    | name, key               | 인증키 유효성 확인          |
| /api/profile_list  | get    | name, key               | 프로필 이미지 리스트        |
| /api/user_setting  | get    | name, key               | 사용자 세팅정보 가져옴      |
| /api/profile_image | put    | name, key, new_profile  | 프로필 이미지 변경          |
| /api/nickname      | put    | name, key, new_nickname | 닉네임 변경                 |
| /api/color         | put    | name, key, new_color    | 색 변경                     |
| /api/chat_info     | get    | name, key               | 채팅 정보 (공지, 유저 정보) |
| /api/chat_history  | get    | name, key               | 채팅 기록                   |



## 에러 메시지

| Message               |          Reason           | Code |
| --------------------- | :-----------------------: | ---- |
| PASSWORD_ERROR        |       비밀번호 오류       | 400  |
| USER_NOT_FOUND        |    사용자 정보가 없음     | 404  |
| KEY_ERROR             |        인증키 오류        | 400  |
| LOGIN_NEED            |      로그인이 필요함      | 401  |
| NEW_NICKNAME_IS_EMPTY | 새로운 닉네임이 비어 있음 | 400  |
| NEW_COLOR_IS_EMPTY    |   새로운 색이 비어있음    | 400  |

