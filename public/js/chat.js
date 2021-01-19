if (!localStorage.getItem("userKey") || !localStorage.getItem("userName")) {
    document.location.href = "/"
}

// 이동 애니메이션
function move() {
    $(".window").css("transform", "scale(1.1)")
    $(".window").css("opacity", "0")
    $(".window").addClass("zoomin")

    setTimeout(() => {
        document.location.href = "/setting"
    }, 200);
}

// 채팅방 이름 설정
if (!localStorage.getItem("title")) {
    localStorage.setItem("title", "설챗 채팅방")
}
$("title").text(localStorage.getItem("title"))
$(".top_mid_big").text(localStorage.getItem("title"))

const userName = localStorage.getItem("userName");
const userKey = localStorage.getItem("userKey");
var chatInfo;
var user_list = [];

// 채팅방 정보 가져오기
$.ajax({
    url: "/api/chat_info",
    type: "GET",
    data: {
        key: userKey,
        name: userName
    },
    dataType: 'json',
}).done(function (json) {
    chatInfo = json
    // 프로필 사진 이미지 변경
    $(".profile_img").attr("src", "/img/profile" + chatInfo[userName].profile)

    // 채팅방 공지 표시
    if (chatInfo.notice && chatInfo.notice != "내리기") {
        $(".noticebar").show()
        $(".noticebar").text(chatInfo.notice.replace("/공지 ", ""))
    } else {
        $(".noticebar").hide()
    }

    // 채팅 기록 가져오기
    $.ajax({
        url: "/api/chat_history",
        type: "GET",
        data: {
            key: userKey,
            name: userName
        },
        dataType: 'json',
    }).done(function (json) {
        json.history.forEach(e => {
            if (e.type == "system") { // 시스템 메세지 (미사용)
                $(".channel").append(`<div class="msg_system_msg"><span style="color: #8d9094">${e.author}</span>님이 ${e.message}했습니다.</div>`)
            } else if (e.type == "message") { // 사용자 메세지
                try {
                    var userPatterns = { // 링크 정규식
                        'url': /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                    }
                    var userReplaceFunctions = function (_url) { return '<a href="' + _url + '">' + _url + '</a>' } // 링크 텍스트에 하이퍼링크 추가

                    var imglink;
                    if (e.message.match(userPatterns['url'])) {
                        var tt = e.message.match(userPatterns['url'])[0]
                        if (tt.endsWith(".jpg") || tt.endsWith(".png") || tt.endsWith(".gif") || tt.endsWith(".jpeg") || tt.endsWith(".svg") || tt.endsWith(".tiff") || tt.endsWith(".webp")) {
                            imglink = e.message.match(userPatterns['url'])[0]
                        }
                        e.message = e.message.replace(userPatterns['url'], userReplaceFunctions)
                    }

                    // 다른 유저 메세지
                    if (e.author != userName) {
                        $(".channel").append(`<div class="msg_your_message">
                        <img src="/img/profile${chatInfo[e.author].profile}" alt="" class="msg_your_img">
                        <div class="msg_your_texts">
                        <div class="msg_your_author"><span style="color: ${chatInfo[e.author].color}">${chatInfo[e.author].nickname}</span> ${e.time}</div>
                        <div class="msg_your_text">${e.message}</div>
                        </div>
                        </div>`)
                        if (imglink) { // 채팅안에 이미지링크가 있으면 같이 표시
                            $(".channel").append(`<div class="msg_your_message_image">
                            <img src="${imglink}" alt="">
                        </div>
                            `)
                        }

                    } else { // 자신의 메세지
                        $(".channel").append(`<div class="msg_my_message">
                        <div class="msg_my_texts">
                        <div class="msg_my_author"><span style="color: ${chatInfo[e.author].color}">${chatInfo[userName].nickname}</span> ${e.time}</div>
                        <div class="msg_my_text">${e.message}</div>
                        </div>
                        </div>`)

                        if (imglink) { // 채팅안에 이미지링크가 있으면 같이 표시
                            $(".channel").append(`<div class="msg_me_message_image">
                            <img src="${imglink}" alt="">
                        </div>
                            `)
                        }
                    }
                } catch (err) { //채팅 분석에 실패한 경우의 오류 시스템 메세지
                    console.log(err)
                    $(".channel").append(`<div class="msg_system_msg">채팅 기록을 불러오지 못했습니다.</div>`)
                }

            } else if (e.type == "date") { // 날짜 메세지
                $(".channel").append(`<div class="msg_system_msg">${e.date}</div>`)
            }
        });

        // 화면 전환 애니메이션
        $(".window").css("transform", "scale(1)")
        $(".window").css("opacity", "1")
        $(".window").addClass("fadein")

        // 화면 맨 아래로
        $(".channel").scrollTop($(".channel")[0].scrollHeight);
    });
}).fail(function (error) {
    if (error.responseText == "LOGIN_NEED") {
        document.location.href = "/"
    }
})



// 현재 활동중인 유저 새로고침
function user_list_reflesh() {
    $(".top_mid_small").text(user_list + "")
    $(".top_right_img").html("")
    user_list.forEach(e => {
        $(".top_right_img").append(`<img src="/img/profile${chatInfo[e].profile}" alt="">`)
    });
}

// 소켓 열기
var socket = io();

// 참가 메세지
socket.emit('client', `참가`, userName);
// 현재 활동중인 유저 파악을 위한 메세지
socket.emit('hello', `안녕`, userName);


// 시스템 이벤트
socket.on('client', function (why, data) {
    $(".channel").append(`<div class="msg_system_msg"><span style="color: #8d9094">${data}</span>님이 ${why}했습니다.</div>`)

    if (data == userName) {
        $(".channel").scrollTop($(".channel")[0].scrollHeight);
    }

    user_list_reflesh()

    // 유저 정보 받아오기
    $.ajax({
        url: "/api/chat_info",
        type: "GET",
        data: {
            key: userKey,
            name: userName
        },
        dataType: 'json',
    }).done(function (json) {
        chatInfo = json
    }).fail(function (error) {
        if (error.responseText == "LOGIN_NEED") {
            document.location.href = "/"
        }
    })

})

// 유저 정보 확인 이벤트
socket.on('hello', function (hi, name) {
    if (hi == "안녕" && name != userName) {
        socket.emit('hello', "하세요!", userName);
    } else {
        if (user_list.indexOf(name) == -1) {
            user_list.push(name)
        }
        user_list_reflesh()
    }
});

//알림 권한 요청
if (!("Notification" in window)) {
    modal("브라우저 알림을 지원히지 않는 브라우저입니다")
} else {
    // 데스크탑 알림 권한 요청
    Notification.requestPermission(function (result) {
        // 권한 거절
        if (result == 'denied') {
            modal('알림을 차단했습니다. 브라우저의 사이트 설정에서 변경하실 수 있습니다.');
            return false;
        }
    });
}

// 데스크탑 알림 함수
function notify(msg) {
    var options = {
        body: msg
    }

    // 데스크탑 알림 띄우기
    var notification = new Notification(localStorage.getItem("title"), options);

    // 3초뒤에 알람 닫기
    setTimeout(function () {
        notification.close();
    }, 3000);
}



//채팅 이벤트
socket.on('chatMessage', function (author, time, msg) {

    // 멘션
    if (msg.indexOf(userName) != -1 || msg.indexOf("@everyone") != -1) {
        notify(msg)
    }

    // 공지
    if (msg.startsWith("/공지 ")) {
        if (msg.replace("/공지 ", "") != "내리기") {
            $(".noticebar").show()
            $(".noticebar").text(msg.replace("/공지 ", ""))
            notify("새로운 공지 : " + msg.replace("/공지 ", ""))
        } else {
            $(".noticebar").hide()
        }
    }

    // 유저 메세지
    var userPatterns = {
        'url': /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    }
    var userReplaceFunctions = function (_url) { return '<a href="' + _url + '">' + _url + '</a>' }
    var imglink;
    if (msg.match(userPatterns['url'])) {
        var tt = msg.match(userPatterns['url'])[0]
        if (tt.endsWith(".jpg") || tt.endsWith(".png") || tt.endsWith(".gif") || tt.endsWith(".jpeg") || tt.endsWith(".svg") || tt.endsWith(".tiff") || tt.endsWith(".webp")) {
            imglink = msg.match(userPatterns['url'])[0]
        }
        msg = msg.replace(userPatterns['url'], userReplaceFunctions)
    }

    if (author != userName) { // 상대방의 메세지
        $(".channel").append(`<div class="msg_your_message"  style="animation: 0.5s ease fadeUp;">
        <img src="/img/profile${chatInfo[author].profile}" alt="" class="msg_your_img">
        <div class="msg_your_texts">
            <div class="msg_your_author"><span style="color: ${chatInfo[author].color}">${chatInfo[author].nickname}</span> ${time}</div>
            <div class="msg_your_text">${msg}</div>
        </div>
    </div>`)

        if (imglink) {
            $(".channel").append(`<div class="msg_your_message_image" style="animation: 0.5s ease fadeUp;">
        <img src="${imglink}" alt="">
    </div>
        `)
        }

    } else { // 자신의 메세지
        $(".channel").append(`<div class="msg_my_message"  style="animation: 0.5s ease fadeUp;">
        <div class="msg_my_texts">
            <div class="msg_my_author"><span style="color: ${chatInfo[author].color}">${chatInfo[author].nickname}</span> ${time}</div>
            <div class="msg_my_text">${msg}</div>
        </div>
    </div>`)

        if (imglink) {
            $(".channel").append(`<div class="msg_me_message_image"  style="animation: 0.5s ease fadeUp;">
        <img src="${imglink}" alt="">
    </div>
        `)
        }

        $(".channel").scrollTop($(".channel")[0].scrollHeight);
    }
});

// 메세지 보내기
function send_message() {
    if ($('#msg').val() != "") {
        let today = new Date();
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        const time = hours + '시 ' + minutes + "분"
        socket.emit('chatMessage', userName, time, $('#msg').val());
        $('#msg').val("")
    }
}

// 공지 보내기
function notice_message() {
    if ($('#msg').val() != "") {
        let today = new Date();
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        const time = hours + '시 ' + minutes + "분"
        socket.emit('chatMessage', userName, time, "/공지 " + $('#msg').val());
        $('#msg').val("")
    }
}

function enter() {
    if (window.event.keyCode == 13) {
        send_message()
    }
}

