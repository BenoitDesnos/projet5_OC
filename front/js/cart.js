/* <---------------------------------------------- constantes & variables  --------------------------------------------------------------------> */

const cartItems = document.getElementById("cart__items");
const cartItem = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const itemQuantity = document.getElementsByClassName("itemQuantity");
const totalPrice = document.getElementById("totalPrice");
const deleteItem = document.getElementsByClassName("deleteItem");
var products = [];

/* <---------------------------------------------- fonctions --------------------------------------------------------------------> */

// recupère les données présentent sur l'api
const retrieveProductsData = () =>
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) =>
      console.log(
        "Une erreur s'est produite sur la fonction retrieveProductsData ",
        err
      )
    );

// remplis le panier en comparant les ids dans l'api et le local storage
const fillCart = (products) => {
  products.map((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      let idStored = localStorage.getItem(localStorage.key(i));
      let idStoredParsed = JSON.parse(idStored);

      // product._id = id dans l'api && idStoredParsed[0] = id dans le localStorage
      if (product._id === idStoredParsed[0]) {
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
        article.setAttribute("data-id", `${localStorage.key(i)}`);
        article.setAttribute("data-color", `${idStoredParsed[2]}`);
        divImg.setAttribute("class", "cart__item__img");
        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);
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
        pInput.setAttribute("value", `${idStoredParsed[1]}`);
        divContentSettingsDelete.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );
        pDelete.setAttribute("class", "deleteItem");

        /* -------------------------- insertion de texte ------------------------------------- */

        h2.innerText = product.name;
        pColor.innerText = idStoredParsed[2];
        pPrice.innerText = product.price + " €";
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
        changeQuantity();
      }
    }
  });
};

// additionne le nombre d'items dans le panier
const sumQuantity = (products) => {
  let totalItems = 0;
  products.forEach((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      let itemStored = localStorage.getItem(localStorage.key(i));
      let itemStoredParsed = JSON.parse(itemStored);
      if (product._id === itemStoredParsed[0]) {
        let nth = itemStoredParsed[1];
        let nthParsed = parseInt(nth);
        totalItems += nthParsed;
      }
    }
    totalQuantity.textContent = totalItems;
  });
};

// additionne le prix des items présent dans le panier
const sumPrice = (products) => {
  let total = 0;
  products.forEach((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      let itemStored = localStorage.getItem(localStorage.key(i));
      let itemStoredParsed = JSON.parse(itemStored);
      if (product._id === itemStoredParsed[0]) {
        let price = product.price;
        let priceParsed = parseInt(price);
        total += priceParsed * itemStoredParsed[1];
        totalPrice.textContent = total;
      }
    }
  });
};

// supprime l'item du localstorage et du DOM
const deleteItemFn = () => {
  // array.from sert à acceder à forEach car getElementsByclassname est une HTMLcollection et non une nodelist
  Array.from(deleteItem).forEach((item) => {
    item.addEventListener("click", () => {
      localStorage.removeItem(item.closest("article").getAttribute("data-id"));
      item.closest("article").remove();
    });
  });
};

// changer le nombre d'items
const changeQuantity = () => {
  // récupère la quantité d'item par item dans le panier
  Array.from(itemQuantity).forEach((quantity) => {
    quantity.addEventListener("change", () => {
      let newItemQuantity = quantity.value;
      let newArray = [];

      // récupère l'item concercné dans le localStorage avec getItem
      newArray = JSON.parse(
        localStorage.getItem(
          quantity.closest("article").getAttribute("data-id")
        )
      );
      // modifie la quantité avec la nouvelle
      newArray[1] = newItemQuantity;
      // renvoie l'item et sa quantité modifié avec setItem.
      let newArrayStringified = JSON.stringify(newArray);
      localStorage.setItem(
        quantity.closest("article").getAttribute("data-id"),
        newArrayStringified
      );
      // fonction ayant besoin d'être mise à jour à chaque changement de quantité
      changeOnInput();
    });
  });
};
// permet d'utiliser sumprice et sumquantity à chaque changement de quantité
const changeOnInput = async () => {
  const productsData = await retrieveProductsData();
  sumPrice(productsData);
  sumQuantity(productsData);
};

// attends les données de l'api pour les fournir à fillCart
const mainCart = async () => {
  const productsData = await retrieveProductsData();
  /* console.log(productsData); */
  fillCart(productsData);
};
mainCart();
changeOnInput();
