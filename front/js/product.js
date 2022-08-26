const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");

let addedToCart = [];
let count = 0;
let colorWatch = "";
let key = [];

// crée une key à partir du titre de l'objet et de sa couleur
function makeKey() {
  key = [];
  key.push(title.textContent, colorWatch);
  fullKey = key.join(" ");
  return fullKey;
}

// ajoute au localstorage un id, nombre d'articles et la couleur
function addToStorage() {
  count = quantity.value;
  colorWatch = colors.value;
  // récupère toutes les clés du localstorage et les stocks dans keys
  let keys = [];
  const keyWatch = () => {
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  };
  keyWatch();

  // récupère les valeurs des differents keys dans la local storage et les stocks dans values
  let values = [];
  const ValueWatch = () => {
    for (let i = 0; i < localStorage.length; i++) {
      values.push(JSON.parse(localStorage[localStorage.key(i)]));
    }
    return values;
  };
  ValueWatch();

  //verifie si une clé contient la meme couleur, si oui change nombre d'article
  if (colorWatch === "") {
    alert("Merci de choisir une couleur !");
  } else if (count == 0) {
    alert("Merci de choisir une quantité !");
  }
  //verifie si la nouvelle key existe deja dans le localstorage (keys)
  else if (keys.includes(makeKey())) {
    for (let i = 0; i < localStorage.length; i++) {
      // on transform count et values en integer pour pouvoir les additionner
      countParsed = parseInt(count);
      valueParsed = parseInt(values[i][1]);
      // nouvelle quantité de l'article
      newCount = countParsed + valueParsed;

      if (newCount > 100) {
        newCount = 100;
      }

      //<----------------------------------------------------------------------->
      // on remplace l'ancienne value par la nouvelle value "stringifiedToCart" dans le localStorage
      addedToCart = [checkIdUrl(), newCount, colorWatch];
      let stringifiedTocart = JSON.stringify(addedToCart);
      localStorage.setItem(makeKey(), stringifiedTocart);
      return alert("Quantité modifiée avec succès !");
    }
  }
  // si aucune des conditions ne sont rencontrées nous ajoutons alors un nouvel item au localsotrage
  else {
    addedToCart = [checkIdUrl(), count, colorWatch];
    let stringifiedTocart = JSON.stringify(addedToCart);
    localStorage.setItem(makeKey(), stringifiedTocart);
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
  console.log(productData);
  fillItemImg(productData);
  fillItemContent(productData);
};
mainProduct();
