//url.js

// const myURL = new URL(
//   "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash",
// );
// console.log(myURL);
// -------------------------------------------------------------------------
// const myURL = new URL("https://example.org/foo#ber");
// console.log(myURL);

// myURL.hash = "baz";
// console.log(myURL.href); //URL만 나오면서 #ber가 #baz로 바뀜

const myURL = new URL("https://example.org/?user=abc&query=xyz");
console.log(myURL.searchParams.get("user"));
console.log(myURL.searchParams.has("user"));
console.log(myURL.searchParams.keys());
console.log(myURL.searchParams.values());
myURL.searchParams.append("user", "admin"); //key에 user가 하나더 추가되었음
console.log(myURL.searchParams.getAll("user"));
myURL.searchParams.set("user", "admin"); //key에 user둘이었는데 하나로 줄어들었음
myURL.searchParams.delete("user");
console.log(myURL.searchParams.toString());

const url = require("url");
console.log(
  url.parse("https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"),
);

//--no-deprecation node경고 안보이게 하기
