/* <---------------------------------------------- constantes & variables  --------------------------------------------------------------------> */

const cartItems = document.getElementById("cart__items");
const cartItem = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const itemQuantity = document.getElementsByClassName("itemQuantity");
const totalPrice = document.getElementById("totalPrice");
const deleteItem = document.getElementsByClassName("deleteItem");
var products = [];
var storedItems = JSON.parse(localStorage.getItem("Panier"));
console.log(storedItems);
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
const fillCart = (apiProducts) => {
  apiProducts.map((apiProduct) => {
    if (storedItems) {
      for (let i = 0; i < storedItems.length; i++) {
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
    }
  });
};

// additionne le nombre d'items dans le panier
const sumQuantity = (apiProducts) => {
  let totalItems = 0;
  apiProducts.forEach((apiProduct) => {
    for (let i = 0; i < storedItems.length; i++) {
      if (apiProduct._id === storedItems.id) {
        let quantity = storedItems.quantity;
        let quantityParsed = parseInt(quantity);
        totalItems += quantityParsed;
      }
    }
    totalQuantity.textContent = totalItems;
  });
};

// additionne le prix des items présent dans le panier
const sumPrice = (apiProducts) => {
  let total = 0;
  apiProducts.forEach((apiProduct) => {
    for (let i = 0; i < storedItems.length; i++) {
      if (apiProduct._id === storedItems.id) {
        let price = apiProduct.price;
        let priceParsed = parseInt(price);
        total += priceParsed * storedItems.quantity;
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
const updateQuantity = () => {
  // récupère la quantité d'item par item dans le panier
  Array.from(itemQuantity).forEach((quantity) => {
    quantity.addEventListener("change", () => {
      let newItemQuantity = quantity.value;
      var myItem = quantity.closest("article");
      for (const item of storedItems) {
        if (
          item.id === myItem.dataset.id &&
          item.color === myItem.dataset.color
        ) {
          item.quantity = newItemQuantity;
        }
      }
      let stringifiedStoreditems = JSON.stringify(storedItems);
      localStorage.setItem("Panier", stringifiedStoreditems);

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
/* changeOnInput(); */
