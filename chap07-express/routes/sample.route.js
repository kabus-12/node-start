//sample.route.js

const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/test/:msg", (rep, res) => {
  console.log(rep.params.msg);
  //test.txt 작성
  fs.writeFile("../test.txt", rep.params.msg, "utf-8", (err, buf) => {
    //err: 예외 , buf:정상처리
    if (err) {
      console.error(err);
      return;
    }
    console.log(buf);
  });
  res.send("/test 페이지 호출");
});
//http://localhost:3000/read => test.txt의 내용을 콘솔에 출력
router.get("/read", (rep, res) => {
  fs.readFile("./test.txt", "utf-8", (err, buf) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(buf);
  });
  // res.send();
  res.redirect("/sample");
});
//http://localhost:3000/sample =>sample.html 화면출력
router.get("/sample", (rep, res) => {
  //비동기처리
  fs.readFile("./sample.html", "utf-8", (err, buf) => {
    if (err) {
      console.error(err);
      // res.send(err);
      res.status(500).send(err);
    }
    console.log(buf);
    // res.send(buf);
    res.status(200).send(buf);
  });
  // 200: 정상, 404:페이지 없음, 500:에러값
});
// router.get("/sample", (rep, res) => {
//   //동기처리
//   const sample = fs.readFileSync("./sample.html", "utf-8");
//   console.log(sample);
//   res.send(sample);
// });

module.exports = router;
