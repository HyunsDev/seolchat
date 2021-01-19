{
    let key = localStorage.getItem("userKey");
    let name = localStorage.getItem("userName");

    if (key && name) {
        $.ajax({
            url: "/api/check",
            type: "GET",
            data: {
                key: key,
                name: name
            },
            dataType: 'json',
        }).done(function (json) {
            if (json.status == "ok") {
                document.location.href = "/chat"
            }
        }).fail(function (error) {
            if (error.status == 400) {
                console.log(error)
                localStorage.removeItem('userKey');
                localStorage.removeItem('userName');
            }
        })
    }
}

if (localStorage.getItem("title")) {
    localStorage.setItem("title", "설챗 채팅방")
    $("title").text(localStorage.getItem("title"))
} else {
    $("title").text(localStorage.getItem("title"))
}

let modal = (modal) => {
    $(".modal_text").text(modal);
    $(".modal").addClass("modal_show");

    setTimeout(() => {
        $(".modal").removeClass("modal_show");
    }, 3000)
}

function login() {
    let name = $("#name").val();
    let password = $("#password").val();
    if (name == "") {
        modal("이름을 입력해주세요.")
    } else if (password == "") {
        modal("비밀번호를 입력해주세요.")
    } else {
        $.ajax({
            url: "/api/login",
            type: "POST",
            data: {
                name: name,
                password: password
            },
            dataType: 'json',
        }).done(function (json) {
            localStorage.setItem("userKey", json["key"])
            localStorage.setItem("userName", name)
            document.location.href = "/chat"
        }).fail(function (error) {
            console.log(error)
            if (error.responseText == "USER_NOT_FOUND") {
                modal(`계정을 찾을 수 없어요.`)
            } else if (error.responseText == "PASSWORD_ERROR") {
                modal(`비밀번호가 틀렸어요.`)
            } else if (error.status != 200) {
                modal(`서버와의 연결에 실패했어요. 오류 코드 ${error.status}`)
            }
        })
    }
}

function enter() {
    if (window.event.keyCode == 13) {
        login();
    }
}