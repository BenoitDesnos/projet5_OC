const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");

let addedToCart = [];
let colorWatch = "";

// récupère le paramètre id dans l'url
const checkIdUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const idParams = params.get("id");
  return idParams;
};
// crée une key à partir du titre de l'objet et de sa couleur
function makeKey() {
  let key = [];
  key.push(checkIdUrl(), colorWatch);
  fullKey = key.join(" ");
  return fullKey;
}

// ajoute au localstorage un id, nombre d'articles et la couleur
function addToStorage() {
  var inputQuantity = quantity.value;
  colorWatch = colors.value;
  if (colorWatch === "") {
    alert("Merci de choisir une couleur !");
  } else if (inputQuantity == 0) {
    alert("Merci de choisir une quantité !");
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      //verifie si la clé que nous créons (makeKey()) existe déjà dans le localStorage (localStorage.key(i))
      if (localStorage.key(i).includes(makeKey())) {
        // on transforme inputQuantity et la quantité dans sotrageArray en integer pour pouvoir les additionner
        let countParsed = parseInt(inputQuantity);
        let quantityParsed = parseInt(
          JSON.parse(localStorage[localStorage.key(i)])[1]
        );
        // nouvelle quantité de l'article
        let newInputQuantity = countParsed + quantityParsed;
        // si le nouveau total est supérieur à 100 on bloque la quantité à 100 et envoie un message d'explication
        if (newInputQuantity > 100) {
          newInputQuantity = 100;
          alert(
            `votre panier contient déjà ${quantityParsed} fois cette article, Le nombre d'article maximal etant de 100, l'article a été ajouté ${
              100 - quantityParsed
            } fois au lieu de ${countParsed}.`
          );
        }
        // on remplace l'ancienne value par la nouvelle value "stringifiedToCart" dans le localStorage
        addedToCart = [checkIdUrl(), newInputQuantity, colorWatch];
        let stringifiedTocart = JSON.stringify(addedToCart);
        localStorage.setItem(makeKey(), stringifiedTocart);
        newInputQuantity = 0;
        return alert("Quantité modifiée avec succès !");
      }
    }
    // si aucune des conditions ne sont rencontrées nous ajoutons alors un nouvel item au localsotrage
    addedToCart = [checkIdUrl(), inputQuantity, colorWatch];
    let stringifiedTocart = JSON.stringify(addedToCart);
    localStorage.setItem(makeKey(), stringifiedTocart);
    alert("Objet ajouté avec succès !");
  }
}
addToCart.addEventListener("click", addToStorage);

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
  itemImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
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
  /* console.log(productData); */
  fillItemImg(productData);
  fillItemContent(productData);
};
mainProduct();
