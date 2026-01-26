const process = require("process");
const os = require("os");

console.log(os.freemem());
// for (let i = 1; i <= 10; i++) {
// console.log(`i의 값은 ${i}`);
// if (i == 5) {
//   process.exit(); //프로세스종료
// }
// }

console.log(process.env.path.split(";"));
