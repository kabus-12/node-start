const xlsx = require("xlsx");
const pool = require("../db.js");
const crypto = require("crypto");

//엑셀파일 읽어오기
const workbook = xlsx.readFile("../uploads/엑셀연습1.xlsx");

//엑셀 파일의 첫 번째 시트 이름 가져오기
const firstSheetName = workbook.SheetNames[0];
//시트 이름을 사용해서 엑셀 파일의 첫 번째 시트 가져오기
const firstSheet = workbook.Sheets[firstSheetName];

const result = xlsx.utils.sheet_to_json(firstSheet);

for (let elem of result) {
  console.log(elem);
  //비밀번호 암호화
  // let password = crypto
  //   .createHash("sha512")
  //   .update("" + elem.password)
  //   .digest("base64");
  //db에 데이터 넣기
  pool.query(
    `update member set user_name = ? where user_id = ?`,
    [elem.user_name, elem.user_id],
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("입력=>", data);
      }
    },
  );
}

// firstSheet["A2"].v = "user99";
// xlsx.writeFile(workbook, "../uploads/엑셀연습2.xlsx");
