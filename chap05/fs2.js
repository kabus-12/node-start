//writeFile, writeFileSync함수
const fs = require("fs");

let data = "파일 쓰기 테스트";

//비동기
fs.writeFile("./fs3.js", data, "utf-8", (err) => {
  if (err) {
    console.error(err);
  }
  console.log("비동기적 파일 쓰기 완료");
});

//동기
const wtxt = fs.writeFileSync("./fs4.js", data, "utf-8");
console.log(wtxt);
