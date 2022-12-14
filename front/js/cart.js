/* <---------------------------------------------- constantes & variables  --------------------------------------------------------------------> */

const cartItems = document.getElementById("cart__items");
const cartItem = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const itemQuantity = document.getElementsByClassName("itemQuantity");
const totalPrice = document.getElementById("totalPrice");
const deleteItem = document.getElementsByClassName("deleteItem");

/* <---------------------------------------------- fonctions --------------------------------------------------------------------> */

// recupère les données présentent sur l'api
const retrieveProductsPromise = () => {
  let storedIdUpdated = [];
  // on déclare un tableau de promesses qui va stocker une promesse par item présent dans le localStorage
  let promises = [];
  // cette boucle sert à supprimer les doublons d'id dans le localStorage
  for (let i = 0; i < storedItems.length; i++) {
    // doublons possiblent dans storedItems[i].id car differentes couleurs avec meme id possible
    // à chaque incrémentation nous verifions donc si l'id à été incrémenté précedemment, sinon on stock le nouvel id pour l'utiliser dans fetch en dessous
    if (!storedIdUpdated.includes(storedItems[i].id)) {
      storedIdUpdated.push(storedItems[i].id);
    }
  }
  // on crée un tableau de promesses qui retourne chaque informations par id
  for (const id of storedIdUpdated) {
    promises.push(
      // on utilise storedIdUpdated pour récuperer les id et cibler notre fetch >> on incremente dans l'array promises pour chaque id unique
      fetch("http://localhost:3000/api/products/" + id)
        .then((res) => res.json())
        .catch((err) =>
          console.log(
            "Une erreur s'est produite sur la fonction retrieveProductsData ",
            err
          )
        )
    );
  }
  // on retourne les promesses afin de les résoudre dans mainCart()
  return promises;
};

// permets de mettre à jour totaux et/ou DOM apres resolution des promesses
const mainCart = () => {
  // retourne le tableau de promesses promises
  const productsPromise = retrieveProductsPromise();
  // on résout les promesses retournées par retrieveProductsPromise() et les passe en arguments des fn
  Promise.all(productsPromise).then((products) => {
    // Cette condition permet de pouvoir lancer la fn sumTotals sans fillCart qui ne se jouera qu'une seule fois au chargement de la page en verifiant si un ou plusieurs child article sont présent sur le DOM
    if (!document.querySelector("#cart__items > article")) {
      // verifie si DOM enfant à cartItems existe
      fillCart(products);
    }
    sumTotals(products);
  });
};

// on verifie si le panier existe dans le localStorage, si oui alors on lance mainCart
if (localStorage.getItem("Panier")) {
  var storedItems = JSON.parse(localStorage.getItem("Panier"));
  mainCart(); // Mise en place DOM et totaux
}

// crée le DOM du panier en comparant les ids dans l'api et le local storage
const fillCart = (apiProducts) => {
  //on joue chaque produits récupérés
  apiProducts.map((apiProduct) => {
    //boucle for pour avoir accès à l'index de storedItems
    for (let i = 0; i < storedItems.length; i++) {
      // dès qu'un id de stocké match avec l'id de l'api on ajoute alors les infos présentent dans l'api au DOM
      if (apiProduct._id === storedItems[i].id) {
        /* -------------------------- creations des éléments ------------------------------------- */
        let article = document.createElement("article");
        let divImg = document.createElement("div");
        let img = document.createElement("img");
        let divContent = document.createElement("div");
        let divContentDescription = document.createElement("div");
        let h2 = document.createElement("h2");
        let pColor = document.createElement("p");
        let pPrice = document.createElement("p");
        let divContentSettings = document.createElement("div");
        let divContentSettingsQuantity = document.createElement("div");
        let pQuantité = document.createElement("p");
        let pInput = document.createElement("input");
        let divContentSettingsDelete = document.createElement("div");
        let pDelete = document.createElement("p");

        /* -------------------------- creations des attributs des éléments ------------------------------------- */

        article.setAttribute("class", "cart__item");
        article.setAttribute("data-id", `${storedItems[i].id}`);
        article.setAttribute("data-color", `${storedItems[i].color}`);
        divImg.setAttribute("class", "cart__item__img");
        img.setAttribute("src", apiProduct.imageUrl);
        img.setAttribute("alt", apiProduct.altTxt);
        divContent.setAttribute("class", "cart__item__content");
        divContentDescription.setAttribute(
          "class",
          "cart__item__content__description"
        );
        divContentSettings.setAttribute(
          "class",
          "cart__item__content__settings"
        );
        divContentSettingsQuantity.setAttribute(
          "class",
          "cart__item__content__settings__quantity"
        );
        pInput.setAttribute("type", "number");
        pInput.setAttribute("class", "itemQuantity");
        pInput.setAttribute("name", "itemQuantity");
        pInput.setAttribute("min", "1");
        pInput.setAttribute("max", "100");
        pInput.setAttribute("value", `${storedItems[i].quantity}`);
        divContentSettingsDelete.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );
        pDelete.setAttribute("class", "deleteItem");

        /* -------------------------- insertion de texte ------------------------------------- */

        h2.innerText = apiProduct.name;
        pColor.innerText = storedItems[i].color;
        pPrice.innerText = apiProduct.price + " €";
        pQuantité.innerText = "Qté :";
        pDelete.innerText = "Supprimer";

        /* -------------------------- insertion des elements crée dans leurs parents ------------------------------------- */

        cartItems.appendChild(article);
        article.append(divImg, divContent);
        divImg.appendChild(img);
        divContent.append(divContentDescription, divContentSettings);
        divContentDescription.append(h2, pColor, pPrice);
        divContentSettings.append(
          divContentSettingsQuantity,
          divContentSettingsDelete
        );
        divContentSettingsQuantity.append(pQuantité, pInput);
        divContentSettingsDelete.appendChild(pDelete);

        /* -------------------------- fonction à lancer dans le scope de fillCart() car besoin des elements sur le DOM ------------------------------------- */

        deleteItemFn();
        updateQuantity();
      }
    }
  });
};

// additionne le nombre d'items dans le panier
const sumTotals = (apiProducts) => {
  let totalP = 0; // total price
  let totalQ = 0; // total Quantity
  apiProducts.forEach((apiProduct) => {
    for (let i = 0; i < storedItems.length; i++) {
      // récupère la quantité et le prix pour chaque produit affiché sur le DOM (quand l'id de l'api match l'id du storage)
      if (apiProduct._id === storedItems[i].id) {
        // on calcul la quantité
        let quantity = storedItems[i].quantity;
        let quantityParsed = parseInt(quantity);
        totalQ += quantityParsed;
        // on calcul le prix
        let price = apiProduct.price;
        let priceParsed = parseInt(price);
        totalP += priceParsed * storedItems[i].quantity;
      }
    }
    // on met à jour le DOM avec les nouvelles données
    totalQuantity.textContent = totalQ;
    totalPrice.textContent = totalP;
  });
};

// supprime l'item du localstorage et du DOM
const deleteItemFn = () => {
  // array.from sert à acceder à forEach car getElementsByclassname est une HTMLcollection et non une nodelist
  Array.from(deleteItem).forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      // on selectionne l'item a supprimer grace à l'index d'items
      let itemToDelete =
        storedItems[Array.from(deleteItem).indexOf(deleteButton)];
      // on garde tous les items qui sont differents de l'item a supprimer grace à filter()
      storedItems = storedItems.filter(
        (storedItems) => storedItems !== itemToDelete
      );
      // on met à jour dans le localStorage sans l'item à supprimer
      let stringifiedstoredItems = JSON.stringify(storedItems);
      localStorage.setItem("Panier", stringifiedstoredItems);

      deleteButton.closest("article").remove();
      mainCart(); // pour mettre à jour totaux
    });
  });
};

// changer le nombre d'items
const updateQuantity = () => {
  // récupère la quantité d'item par item dans le panier
  Array.from(itemQuantity).forEach((quantity) => {
    quantity.addEventListener("change", () => {
      let newItemQuantity = quantity.value; // nouvelle quantité à chanque input change
      let myItem = quantity.closest("article"); // selectionne la balise article de l'item dont on change la quantité
      for (const item of storedItems) {
        //on vérifie si l'item dont on change la quantité  est présent dans le sotrage
        if (
          item.id === myItem.dataset.id &&
          item.color === myItem.dataset.color
        ) {
          //si oui on change la quantité
          item.quantity = newItemQuantity;
        }
      }
      // et on met à jour dans le localStorage
      let stringifiedStoreditems = JSON.stringify(storedItems);
      localStorage.setItem("Panier", stringifiedStoreditems);

      mainCart(); // pour mettre à jour totaux
    });
  });
};
