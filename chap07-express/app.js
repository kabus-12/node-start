require("dotenv").config();
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const transporter = require("./extensions/nodemailer");
const pool = require("./db");
const cron_jop = require("./extensions/nodecron");

const app = express(); //인스턴스

//포트 : 3000
const SERVER_PORT = 3000;

//multer 모듈을 활용하기 위한 설정
const storage = multer.diskStorage({
  //저장경로
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/images");
  },
  //파일이름
  filename: (req, file, cb) => {
    const file_name = Buffer.from(file.originalname, "latin1").toString(
      "utf-8",
    ); //키보드_123123123.png
    const fn = file_name.substring(0, file_name.indexOf("."));
    const ext = file_name.substring(file_name.indexOf(".") + 1);
    cb(null, fn + "_" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage }); //multer 모듈의 인스턴스

//public폴더의 html,css,js url을 통해서 접근
app.use(express.static("public"));

app.use(express.json()); //json 형태의 데이터 수신 가능
//json 형태의 데이터 수신 가능 application/json
app.use(express.urlencoded({ extended: true })); //form데이터 수신 가능
// form 데이터 수신 가능. application/x-www-form-urlencoded

//라우팅 url :실행함수
app.get("/", (req, res) => {
  //실행할 기능
  res.send("/페이지 호출");
});
//라우팅 파일
app.use("/sample", require("./routes/sample.route"));

//스케줄잡 시작
app.get("/start", (req, res) => {
  console.log("메일발송 시작");
  cron_jop.start();
  res.send("메일발송 시작됨");
});
//스케줄잡 종료
app.get("/end", (req, res) => {
  console.log("메일발송 종료");
  cron_jop.stop();
  res.send("메일발송 종료됨");
});

// /members/guest@email.com
app.get("/members/:to", async (req, res) => {
  const to = req.params.to;
  //member 테이블 조회
  let [result, sec] = await pool.query(
    "select * from member where responsibility = 'User'",
  );
  let html = `<table border = "2">
  <thead>
  <tr>
  <th>id</th>
  <th>이름</th>
  <th>이미지</th>
  <th>권한</th>
  </tr>
  </thead>
  <tbody>`;
  html += result
    .map(
      (elem) => `<tr><td>${elem.user_id}</td>
    <td>${elem.user_name}</td>
    <td>${elem.user_img}</td>
    <td>${elem.responsibility}</td></tr>`,
    )
    .join("");
  html += `</tbody>
  </table>`;

  //결과 result
  //sendMail start
  transporter.sendMail(
    {
      from: process.env.FROM,
      to,
      subject: "회원목록",
      html,
    },
    (err, info) => {
      if (
        (err) => {
          res.json({ retCode: "NG", retMag: err });
        }
      );
      res.json({ retCode: "OK", retMsg: info });
    },
  );
  //sendMail end
});

//메일발송
app.post("/mail_send", upload.single("img"), async (req, res) => {
  const { to, subject, text } = req.body;
  const file_name = req.file ? req.file.filename : null;
  console.log(req.file.filename);

  const html = text
    .split("\n")
    .map((elem) => "<p>" + elem + "</p>")
    .join("");
  //sendMail start
  transporter.sendMail(
    {
      from: process.env.FROM,
      to,
      subject,
      html,
      attachments: [
        {
          // filename: req.file.filename,
          //path: path.join(__dirname, "public/images"),
          path: path.join(__dirname, "public/images", req.file.filename),
        },
      ],
    },
    (err, info) => {
      if (
        (err) => {
          console.log("error", err);
          res.json({ retCode: "NG", retMag: err });
        }
      );
      console.log("ok", info);
      const ufile = path.join(__dirname, "public/images", file_name);
      fs.unlink(ufile, (err) => {
        if (err) {
          console.log(`파일 삭제중 error => ${err}`);
        } else {
          console.log(`파일 삭제 완료 => ${ufile}`);
        }
      });
      res.json({ retCode: "OK", retMsg: info });
    },
  );
  //sendMail end

  console.log("sendmail start==>");
});

app.post("/upload", upload.single("user_img"), (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.file.filename);
  //경로:public/images업로드
  //
  res.json({
    user_name: req.body.user_name,
    user_age: req.body.user_age,
    filename: req.file.filename,
  });
});

//회원추가
app.post("/create", upload.single("user_img"), async (req, res) => {
  const { user_id, user_pw, user_name } = req.body;
  const file_name = req.file ? req.file.filename : null;
  //암호화 비밀번호
  let passwd = crypto
    .createHash("sha512") //암호화방식
    .update(user_pw) //암호화할 평문
    .digest("base64"); //인코딩 방식

  try {
    //db 입력
    let result = await pool.query(
      "insert into member(user_id,user_pw,user_name,user_img) values(?,?,?,?)",
      [user_id, passwd, user_name, file_name],
    );
    //반환결과
    res.json({ retCode: "OK" });
  } catch (err) {
    const ufile = path.join(__dirname, "public/images", file_name);
    fs.unlink(ufile, (err) => {
      if (err) {
        console.log(`파일 삭제중 error => ${err}`);
      } else {
        console.log(`파일 삭제 완료 => ${ufile}`);
      }
    });
    res.json({ retCode: "NG", retMsg: err.sqlMessage });
  }
});

//요청방식: post, url(/login),body(/req.body)의 값 (id,pw)
//pw => 암호화.
//select * from member where id=? and pw=? 혹은 select count(*) as cnt from member where id=? and pw=?
//조회(1) -> retCode:OK, 조회(0) => retCode.NG
app.post("/login", async (req, res) => {
  const { user_id, user_pw } = req.body;
  let pawd = crypto.createHash("sha512").update(user_pw).digest("base64");
  let [result, sec] = await pool.query(
    "select user_name,responsibility from member where user_id=? and user_pw=?",
    [user_id, pawd],
  );
  console.log(result);
  if (result.length == 1) {
    res.json({
      retCode: "OK",
      name: result[0].user_name,
      role: result[0].responsibility,
    });
  } else {
    res.json({ retCode: "NG" });
  }
});

app.delete("/delete/:uid", async (req, res) => {
  const user_id = req.params.uid;
  const [file_name, sec1] = await pool.query(
    "select user_img from member where user_id = ?",
    [user_id],
  );
  const [result, sec] = await pool.query(
    "delete from member where user_id = ? ",
    [user_id],
  );
  console.log(file_name[0]);
  if (result.affectedRows) {
    const ufile = path.join(__dirname, "public/images", file_name[0].user_img);
    fs.unlink(ufile, (err) => {
      if (err) {
        console.log("파일 삭제중 에러");
      } else {
        console.log("파일 삭제 완료 ");
      }
      res.json(result);
    });
  }
});

//회원목록
app.get("/list", async (req, res) => {
  let [result, sec] = await pool.query("select * from member");
  res.json(result);
});

//실행
app.listen(SERVER_PORT, () => {
  console.log(`서버 실행 http://localhost:${SERVER_PORT}`);
});
