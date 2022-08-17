const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");

let addedToCart = [];
let addedToCart2 = [];
function addToStorage() {
  console.log(addedToCart[2]);
  if (addedToCart[2] !== colors.value || addedToCart[2] !== undefined) {
    console.log("test");
    addedToCart2 = [
      (id = checkIdUrl()),
      (quantity = quantity.value),
      (color = colors.value),
    ];
    let stringifiedTocart = JSON.stringify(addedToCart2);
    localStorage.setItem("test", stringifiedTocart);
    console.log(addedToCart2);
  }
  console.log("test2");
  addedToCart = [
    (id = checkIdUrl()),
    (quantity = quantity.value),
    (color = colors.value),
  ];
  let stringifiedTocart = JSON.stringify(addedToCart);
  localStorage.setItem(checkIdUrl(), stringifiedTocart);
}

addToCart.addEventListener("click", addToStorage);

const checkIdUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const idParams = params.get("id");
  return idParams;
};

const retrieveProductsData = () =>
  fetch("http://localhost:3000/api/products/" + checkIdUrl())
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) =>
      console.log(
        "Une erreur s'est produite sur la fonction retrieveProductsData ",
        err
      )
    );

const fillItemImg = (product) => {
  itemImg.innerHTML = `<img src="${product.imageUrl}" alt="Photographie d'un canapé"></img>`;
};

const fillItemContent = (product) => {
  title.textContent = product.name;
  price.textContent = product.price;
  description.textContent = product.description;
  let productColors = product.colors;
  productColors.forEach((color) => {
    colors.innerHTML += `<option class="test" value="${color}">${color}</option>`;
  });
};

const mainProduct = async () => {
  const productData = await retrieveProductsData();
  console.log(productData);

  fillItemImg(productData);
  fillItemContent(productData);
};
mainProduct();
