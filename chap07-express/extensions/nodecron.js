require("dotenv").config({ path: "../.env" });
const cron = require("node-cron");
const transporter = require("./nodemailer");

const cron_jop = cron.schedule(
  "* * * 1 * *",
  () => {
    transporter.sendMail(
      {
        from: process.env.FROM,
        to: "dksgudwn15@naver.com",
        subject: "히오~스",
        text: "♚♚히어로즈 오브 더 스☆톰♚♚가입시$$전원 카드팩☜☜뒷면100%증정※ ?월드오브 워크래프트?펫 무료증정💴 특정조건 §§디아블로3§§★공허의유산★초상화획득기회@@ 즉시이동http://kr.battle.net/heroes/ko/",
      },
      (err) => {
        if (err) {
          console.log("발송에러");
        }
        console.log("발송완료");
      },
    );
    console.log("★★★★★★★★★★메일발송 시작★★★★★★★★★★");
  },
  {
    schedule: false,
  },
);

//start()호출
//cron_jop.start()

module.exports = cron_jop;
