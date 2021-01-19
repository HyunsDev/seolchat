if (!localStorage.getItem("userKey") || !localStorage.getItem("userName")) {
    document.location.href = "/"
}

const userName = localStorage.getItem("userName");
const userKey = localStorage.getItem("userKey");

// 이동 애니메이션
function move() {
    $(".window").css("transform", "scale(0.9)")
    $(".window").css("opacity", "0")
    $(".window").addClass("zoomout")
    setTimeout(() => {
        document.location.href = "/chat"
    }, 200);
}

// 이동 애니메이션 2
function move2() {
    $(".window").css("transform", "scale(0.9)")
    $(".window").css("opacity", "0")
    $(".window").addClass("zoomout")
    setTimeout(() => {
        document.location.href = "/profile"
    }, 200);
}

// 채팅방 이름 설정
if (!localStorage.getItem("title")) {
    localStorage.setItem("title", "설챗 채팅방")
    $("title").text(localStorage.getItem("title"))
} else {
    $("title").text(localStorage.getItem("title"))
}

// Modal 빨간색 설정
let modal = (modal) => {
    $(".modal_text").text(modal);
    $(".modal").addClass("modal_show");

    setTimeout(() => {
        $(".modal").removeClass("modal_show");
    }, 3000)
}

// Modal 파란색 설정
let modal_good = (modal) => {
    $(".modal_good_text").text(modal);
    $(".modal_good").addClass("modal_good_show");

    setTimeout(() => {
        $(".modal_good").removeClass("modal_good_show");
    }, 3000)
}

// 유저 세팅 불러오기
$.ajax({
    url: "/api/user_setting",
    type: "GET",
    data: {
        name: userName,
        key: userKey
    },
    dataType: 'json'
}).done(function (json) {
    $("#name").val(json.nickname)
    $("#color").val(json.color)
    if (localStorage.getItem("title")) {
        $("#title").val(localStorage.getItem("title"))
    } else {
        $("#title").val("설챗 채팅방")
    }
    $(".window").css("transform", "scale(1)")
    $(".window").css("opacity", "1")
    $(".window").addClass("fadeout")
}).fail(function (error) {
    if (error.status != 200) {
        modal(`서버와의 연결에 실패했어요. 오류 코드 ${error.status}`)
    }
})

// 닉네임 변경
function nickname() {
    let new_nick = $("#name").val()
    if (new_nick != "") {
        let key = localStorage.getItem("userKey");
        let name = localStorage.getItem("userName");

        $.ajax({
            url: "/api/nickname",
            type: "PUT",
            data: {
                key: userKey,
                name: userName,
                new_nickname: new_nick
            },
            dataType: 'json'
        }).done(function (json) {
            modal_good("닉네임 변경 완료!")

        }).fail(function (error) {
            if (error.responseText == "LOGIN_NEED") {
                document.location.href = "/"
            }
            if (error.status != 200) {
                modal(`서버와의 연결에 실패했어요. 오류 코드 ${error.status}`)
            }
        })
    } else {
        modal(`별명을 적어주세요!`)
    }
}

// 닉네임 변경 엔터키
function enter() {
    if (window.event.keyCode == 13) {
        nickname()
    }
}

// 이름 색 변경
function color() {
    let new_color = $("#color").val()

    if (new_color != "" && new_color.length == 7) {
        let key = localStorage.getItem("userKey");
        let name = localStorage.getItem("userName");

        $.ajax({
            url: "/api/color",
            type: "PUT",
            data: {
                key: key,
                name: name,
                new_color: new_color
            },
            dataType: 'json'
        }).done(function (json) {
            modal_good("이름 색상 변경 완료!")

        }).fail(function (error) {
            if (error.responseText == "LOGIN_NEED") {
                document.location.href = "/"
            }
            if (error.status != 200) {
                modal(`서버와의 연결에 실패했어요. 오류 코드 ${error.status}`)
            }
        })
    } else {
        modal(`색상을 정확히 적어주세요!`)
    }
}

// 이름 색 변경 엔터키
function color_enter() {
    if (window.event.keyCode == 13) {
        color()
    }
}

// 채팅방 이름 변경
function title_change() {
    let title = $("#title").val()
    if (title.length != 0) {
        localStorage.setItem('title', title);
        $("title").text(localStorage.getItem("title"))
        modal_good("사이트 이름 변경 완료!")
    } else {
        modal("사이트 제목을 적어주세요.")
    }

}

// 채팅방 이름 변경 엔터키
function title_enter() {
    if (window.event.keyCode == 13) {
        title_change()
    }
}