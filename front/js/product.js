const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
console.log(localStorage);
var colorWatch = "";
var arrayOfCart = [];

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

// récupère le paramètre id dans l'url
const checkIdUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const idParams = params.get("id");
  return idParams;
};
// crée une key à partir du titre de l'objet et de sa couleur
const createNewItem = (inputQuantity, colorWatch) => {
  let storedItems = JSON.parse(localStorage.getItem("Panier"));
  let newItem = {
    id: checkIdUrl(),
    quantity: inputQuantity,
    color: colorWatch,
  };
  if (storedItems) {
    storedItems.push(newItem);
  } else {
    storedItems = [];
    storedItems.push(newItem);
  }

  let stringifiedStoreditems = JSON.stringify(storedItems);
  localStorage.setItem("Panier", stringifiedStoreditems);
  alert("Objet ajouté avec succès !");
};

// ajoute au localstorage un id, nombre d'articles et la couleur
function addToStorage() {
  let storedItems = JSON.parse(localStorage.getItem("Panier"));
  let inputQuantity = quantity.value;
  colorWatch = colors.value;
  if (colorWatch === "") {
    alert("Merci de choisir une couleur !");
  } else if (inputQuantity == 0) {
    alert("Merci de choisir une quantité !");
  } else {
    // on récupère le panier dans le localStorage

    //verifie si sotredItems existe
    if (storedItems) {
      for (const item of storedItems) {
        // verifie si l'objet que nous ajoutons existe deja dans le localstorage (meme couleur & id)
        if (item.id.includes(checkIdUrl()) && item.color.includes(colorWatch)) {
          // on transforme inputQuantity et la quantité dans le localStorage en integer pour pouvoir les additionner
          let inputQuantityParsed = parseInt(inputQuantity);
          let quantityParsed = parseInt(item.quantity);
          // nouvelle quantité de l'article
          let newInputQuantity = inputQuantityParsed + quantityParsed;
          // si le nouveau total est supérieur à 100 on bloque la quantité à 100 et envoie un message d'explication
          if (newInputQuantity > 100) {
            newInputQuantity = 100;
            alert(
              `votre panier contient déjà ${quantityParsed} fois cette article, Le nombre d'article maximal etant de 100, l'article a été ajouté ${
                100 - quantityParsed
              } fois au lieu de ${inputQuantityParsed}.`
            );
          }
          item.quantity = newInputQuantity;
          let stringifiedStoreditems = JSON.stringify(storedItems);
          localStorage.setItem("Panier", stringifiedStoreditems);
          newInputQuantity = 0;
          return alert("Quantité modifiée avec succès !");
        }
      }

      createNewItem(inputQuantity, colorWatch);
    }
    //si storedItems n'existe pas >> rien dans le localStorage
    else {
      createNewItem(inputQuantity, colorWatch);
    }
    // si aucune des conditions ne sont rencontrées nous ajoutons alors un nouvel item au localsotrage
  }
}
addToCart.addEventListener("click", addToStorage);

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
