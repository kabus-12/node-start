//post.js
//http://localhost:3001/  //index
//http://localhost:3001/products

fetch("boards?writer=김철수&id=3")
  .then((resp) => resp.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

//상품(상품번호, 상품명, 가격, 판매자)
//상품후기(후기번호, 상품후기, 상품번호, 작성자)

fetch("products?id=1")
  .then((resp) => resp.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

fetch("products")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
    data.forEach((elem) => {
      const Str = `<tr>
      <td>${elem.id}</td>
      <td>${elem.name}</td>
      <td>${elem.price}</td>
      <td>${elem.seller}</td>
      <td><img width="120px" src="img/${elem.img}"></td>
      </tr>`;
      document.getElementById("list").insertAdjacentHTML("beforeend", Str);
    });
  })
  .catch((err) => console.error(err));

fetch("reviews")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err));

async function reviewInfo() {
  const data = await fetch("reviews?productId = 1");
  const result = await data.json();
  console.log(result);
}

reviewInfo();
