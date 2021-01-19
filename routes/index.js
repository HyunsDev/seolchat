var express = require('express');
var router = express.Router();
const fs = require('fs');
var dayjs = require("dayjs")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});

router.get('/setting', function(req, res, next) {
  res.render('setting');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});


/* API */

// user.json 에서 해당 유저에 대한 정보 반환
// 만약 유저 목록에 없으면 false 반환
function getUserInfo(name) { //유저 이름 받음
  const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
  const jsonData = JSON.parse(jsonFile);

  if (Object.keys(jsonData).indexOf(name) != -1) {
    return jsonData[name]
  } else {
    return false
  }
}

// 유저 새로운 인증키 발급
// 기존의 인증키를 폐기하고 새로운 인증키를 반환
function refleshUserKey(name) {
  let new_key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  let user = getUserInfo(name)
  if (user) {
    const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
    let jsonData = JSON.parse(jsonFile);
    jsonData[name].key = new_key;
    fs.writeFileSync('./config/user.json', JSON.stringify(jsonData, null, 4))
    return new_key
  } else {
    return false
  }
}

// 유저가 로그인 상태인지를 Bool로 반환
function userIsTrue(name, key) { //이름과 api키 받음
  const user = getUserInfo(name)
  if(user && user.key == key) {
      return true
  } else {
    return false
  }
}

// 로그인 요청
router.post('/api/login', function(req, res, next) {
  const name = req.body.name;
  const password = req.body.password;
  let user = getUserInfo(name);

  if(user) {
    if (user.password == password) {
      let key = refleshUserKey(name);
      res.send({status: "ok", key: key})
    } else {
      res.status(400).send("PASSWORD_ERROR");
    }
  } else {
    res.status(403).send("USER_NOT_FOUND");
  }
});

// 인증키 유효성 확인
router.get('/api/check', function(req, res, next) {
  const userKey = req.query.key
  const userName = req.query.name

  const user = getUserInfo(userName)
    if (user.key == userKey) {
      res.send({status: "ok"})
    } else {
      res.status(400).send("KEY_ERROR");
    }

});

// 프로필 이미지 리스트
router.get('/api/profile_list', function(req, res, next) {
  const userKey = req.query.key
  const userName = req.query.name
  if(userIsTrue(userName, userKey)) {
    let user_profile = getUserInfo(userName).profile
    fs.readdir("./public/img/profile/nomal", function(error, filelist){
      console.log();
      res.send({profile: user_profile, list: filelist})
    })
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

// 사용자의 세팅정보 (닉네임, 닉네임 색) 전송
router.get('/api/user_setting', function(req, res, next) {
  const userKey = req.query.key
  const userName = req.query.name
  if(userIsTrue(userName, userKey)) {
    let nickname = getUserInfo(userName).nickname
    let color = getUserInfo(userName).color
    res.send({nickname: nickname, color: color})
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

//프로필 이미지 변경
router.put('/api/profile_image', function(req, res, next) {
  const userKey = req.body.key
  const userName = req.body.name
  const newProfile = req.body.new_profile

  if (userIsTrue(userName, userKey)) {
    const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
    let jsonData = JSON.parse(jsonFile);
    jsonData[userName].profile = newProfile;
    fs.writeFileSync('./config/user.json', JSON.stringify(jsonData, null, 4))
    res.send({result: "ok"})
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

// 닉네임 변경
router.put('/api/nickname', function(req, res, next) {
  const userKey = req.body.key
  const userName = req.body.name
  const newNick = req.body.new_nickname

  if(userIsTrue(userName, userKey)) {
    if (newNick != "") {
      const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
      let jsonData = JSON.parse(jsonFile);
      jsonData[userName].nickname = newNick;
      fs.writeFileSync('./config/user.json', JSON.stringify(jsonData, null, 4))
      res.send({result: "ok"})
    } else {
      res.status(400).send("NEW_NICKNAME_IS_EMPTY")
    }
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

// 색 변경
router.put('/api/color', function(req, res, next) {
  const userKey = req.body.key
  const userName = req.body.name
  const newColor = req.body.new_color
  if(userIsTrue(userName, userKey)) {
    if (newColor != "") {
      const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
      let jsonData = JSON.parse(jsonFile);
      jsonData[userName].color = newColor;
      fs.writeFileSync('./config/user.json', JSON.stringify(jsonData, null, 4))
      res.send({result: "ok"})
    } else {
      res.status(400).send("NEW_COLOR_IS_EMPTY")
    }
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

// 채팅 정보 (공지, 유저 정보)
router.get('/api/chat_info', function(req, res, next) {
  const userKey = req.query.key
  const userName = req.query.name

  if(userIsTrue(userName, userKey)) {
    const jsonFile = fs.readFileSync('./config/user.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    const noticeFile = fs.readFileSync('./config/notice.json', 'utf8');
    const noticeData = JSON.parse(noticeFile);

    let data = {
      notice: noticeData.content
    }
    let userdata = Object.keys(jsonData)

    userdata.forEach(e => {
      data[e] = {
        nickname: jsonData[e]["nickname"],
        profile: jsonData[e]["profile"],
        color: jsonData[e]["color"]
      }
    });

    res.send(data)
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});

// 채팅 기록
router.get('/api/chat_history', function(req, res, next) {
  const userKey = req.query.key
  const userName = req.query.name

  if(userIsTrue(userName, userKey)) {
    let history = []
    var now = dayjs()

    for (var i = 0; i < 4; i++) {
      var d = now.subtract(i, "day").format('YYYY_MM_DD')
      try {
        var j = fs.readFileSync(`./chat_log/${d}.json`, 'utf8');

        var dd = {date:now.subtract(i, "day").format('YYYY년 MM월 DD일'), type: "date"}
        history.push(dd)

        var jd = JSON.parse(j).message;
        jd.forEach(e => {
          history.push(e)
        });
      } catch (error) {
        console.log(d +"의 채팅 기록을 불러올 수 없습니다.")
        continue
      }
    }
    res.send({history: history})
  } else {
    res.status(401).send("LOGIN_NEED");
  }
});


module.exports = router;
