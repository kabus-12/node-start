const fs = require("fs");

//비동기
fs.readFile("./path.js", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
  }
  console.log(data);
});

//비동기
const txt = fs.readFileSync("./process.js", "utf-8");
console.log(txt);

console.log("end");
