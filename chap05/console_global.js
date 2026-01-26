//
console.time("time check");
for (let i = 1; i <= 100000; i++) {}
console.timeEnd("time check");

console.log(`Hello, Choi`);
console.error(`Error 발생`);

const ary = [
  { name: "홍길동", age: 20 },
  { name: "김길동", age: 22 },
];
console.table(ary); //표형식 출력

const obj = {
  id: 1, // depth 1
  profile: {
    // depth 2
    name: "홍길동",
    contact: {
      // depth 3
      email: "hong@test.com",
      address: {
        // depth 4
        city: "서울",
        detail: {
          // depth 5
          street: "강남대로",
          zipCode: "12345",
        },
      },
    },
  },
};
console.log(obj);
