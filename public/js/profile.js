if (!localStorage.getItem("userKey") || !localStorage.getItem("userName")) {
    document.location.href = "/"
}

const userName = localStorage.getItem("userName");
const userKey = localStorage.getItem("userKey");

//이동 애니메이션
function move() {
    $(".window").css("transform", "scale(0.9)")
    $(".window").css("opacity", "0")
    $(".window").addClass("zoomout")

    setTimeout(() => {
        document.location.href = "/setting"
    }, 200);
}

// 채팅방 이름 설정
if (!localStorage.getItem("title")) {
    localStorage.setItem("title", "설챗 채팅방")
    $("title").text(localStorage.getItem("title"))
} else {
    $("title").text(localStorage.getItem("title"))
}

// Modal 항수
let modal = (modal) => {
    $(".modal_text").text(modal);
    $(".modal").addClass("modal_show");

    setTimeout(() => {
        $(".modal").removeClass("modal_show");
    }, 3000)
}

// 이동 애니메이션
$(".window").css("transform", "scale(1)")
$(".window").css("opacity", "1")
$(".window").addClass("fadeout")

$.ajax({
    url: "/api/profile_list",
    type: "GET",
    data: {
        key: userKey,
        name: userName
    },
    dataType: 'json',
}).done(function (json) {
    json.list.forEach(e => {
        $("#nomal").append(`<div class="img"><img src="/img/profile/nomal/${e}"  onclick="img_go(this)"  class="profile" alt="" id="/nomal/${e}"></div>`)
    });
    $(`img[src="/img/profile${json.profile}"]`).addClass("isSelect")
}).fail(function (error) {
    console.log(error)
})

// 프로필 사진 선택
function img_go(div) {
    let img_id = $(div).attr("id");

    $.ajax({
        url: "/api/profile_image",
        type: "PUT",
        data: {
            key: userKey,
            name: userName,
            new_profile: img_id
        },
        dataType: 'json'
    }).done(function (json) {
        $(".profile").removeClass("isSelect")
        $(div).addClass("isSelect")

    }).fail(function (error) {
        if (error.responseText == "LOGIN_NEED") {
            document.location.href = "/"
        }
        if (error.status != 200) {
            modal(`서버와의 연결에 실패했어요. 오류 코드 ${error.status}`)
        }
    })
}