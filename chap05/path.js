//파일의 경로, 확장자, 파일명
const path = require("path");

console.log(__dirname); //실행폴더
console.log(__filename); //실행파일
console.log(path.basename(__filename, ".js")); //파일명

// path.format){
console.log(
  path.format({
    root: "/",
    dir: "/temp/txt",
    name: "test",
    ext: "txt",
  }),
);

console.log(path.delimiter);

console.log(process.env.PATH);
process.env.PATH.split(path.delimiter);

console.log(__filename);
console.log(path.dirname(__filename));

console.log(path.extname("index.html"));

const fff = path.isAbsolute("path.js");
console.log(fff);

const xxx = path.join("/foo", "bar", "baz/asdf");
console.log(xxx);

const ttt = path.parse("/home/user/dir/file.txt");
console.log(ttt);

console.log(path.sep);
"foo\\bar\\baz".split(path.sep);
