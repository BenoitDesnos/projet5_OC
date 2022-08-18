const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");

let addedToCart = [];
let count = 0;
let colorWatch = "";
let randomIds = [];
let id = [];

// crée un random id et le stock dans l'array randomIds, rejoue la fonction si id existe dans randomIds
function makeId() {
  /* let length = 20;
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if (randomIds.includes(result)) {
    makeId();
  }
  randomIds.push(result);
  console.log(randomIds);
  return result; */
  id = [];
  id.push(title.textContent, colorWatch);
  let fullId = id.join(" ");
  return fullId;
}

// ajoute au localstorage un id, nombre d'articles et la couleur
function addToStorage() {
  count = quantity.value;
  colorWatch = colors.value;

  // récupère toutes les clés du localstorage
  let key = "";
  const keyWatch = () => {
    for (let i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      return key;
    }
  };
  keyWatch();

  //verifie si une clé contient la couleur meme couleur, si oui change nombre d'article

  if (colorWatch === "") {
    alert("Merci de choisir une couleur !");
  } else if (count == 0) {
    alert("Merci de choisir une quantité !");
  }

  // verifie si une clé contient la couleur meme couleur, si oui prévient artcile déjà dans panier
  else if (key.includes(colorWatch) && count === addedToCart[1]) {
    alert("Objet déjà présent dans le panier");
  }
  // verifie si meme couleur et quantité differente, si oui change quantité dans la bonne key du localStorage
  else if (key.includes(colorWatch) && count !== addedToCart[1]) {
    addedToCart[1] = count;
    let stringifiedTocart = JSON.stringify(addedToCart);
    localStorage.setItem(key, stringifiedTocart);
  }
  // si aucun des cas du dessus alors crée id et sotck dans le local storage
  else {
    addedToCart = [checkIdUrl(), count, colorWatch];
    let stringifiedTocart = JSON.stringify(addedToCart);
    localStorage.setItem(makeId(), stringifiedTocart);
    alert("Objet ajouté avec succès !");
  }
}
addToCart.addEventListener("click", addToStorage);

// récupère le paramètre id dans l'url
const checkIdUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const idParams = params.get("id");
  return idParams;
};

// récupère la data de l'api à l'aide de l'id dans l'url
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

// les deux fonctions suivantes remplissent le html à l'aide de la fonction mainProduct en dessous qui récupère la data en asynchrone
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

// récupère la data en asynchrone
const mainProduct = async () => {
  const productData = await retrieveProductsData();
  console.log(productData);
  fillItemImg(productData);
  fillItemContent(productData);
};
mainProduct();
