const cartItems = document.getElementById("cart__items");
const cartItem = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const itemQuantity = document.getElementsByClassName("itemQuantity");
const totalPrice = document.getElementById("totalPrice");
const deleteItem = document.getElementsByClassName("deleteItem");

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
const fillCart = async (products) => {
  products.forEach((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      let idStored = localStorage.getItem(localStorage.key(i));
      let idStoredParsed = JSON.parse(idStored);

      // product._id = id dans l'api && idStoredParsed[0] = id dans le localStorage
      if (product._id === idStoredParsed[0]) {
        cartItems.innerHTML += `<article class="cart__item" data-id="${localStorage.key(
          i
        )}" data-color="${idStoredParsed[2]}">
    <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
    <h2>${product.name}</h2>
    <p>${idStoredParsed[2]}</p>
    <p>${product.price} €</p>
    </div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : ${idStoredParsed[1]} </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
      idStoredParsed[1]
    }">
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    `;
        deleteItemFn();
        changeNumberitem();
      }
    }
  });
};

// additionne le nombre d'items dans le panier
const sumQuantity = (products) => {
  let total = 0;
  products.forEach((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      let itemStored = localStorage.getItem(localStorage.key(i));
      let itemStoredParsed = JSON.parse(itemStored);
      if (product._id === itemStoredParsed[0]) {
        let nth = itemStoredParsed[1];
        let nthParsed = parseInt(nth);
        total += nthParsed;
      }
    }
    totalQuantity.textContent = total;
  });
};

// additionne le prix des items dans le panier
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

// supprime un item
const deleteItemFn = () => {
  for (let i = 0; i < deleteItem.length; i++) {
    deleteItem[i].addEventListener("click", () => {
      localStorage.removeItem(cartItem[i].getAttribute("data-id"));
      location.reload();
    });
  }
};
// changer le nombre d'items
const changeNumberitem = () => {
  // récupère la quantité d'item par item dans le panier
  for (let i = 0; i < itemQuantity.length; i++) {
    // mis à jour à chaque changement de quantité
    itemQuantity[i].addEventListener("change", () => {
      let id = cartItem[i].getAttribute("data-id");
      const quantity = document.querySelector(
        `[data-id="${id}"]  .cart__item__content__settings__quantity p`
      );
      let newItemQuantity = itemQuantity[i].value;
      let newArray = [];

      // incrémente la nouvelle quantité dans l'item
      quantity.textContent = `Qté : ${newItemQuantity}`;

      // incrémente le nouveau total des quantités des items dans le panier
      newArray = JSON.parse(
        localStorage.getItem(cartItem[i].getAttribute("data-id"))
      );
      newArray[1] = newItemQuantity;
      let newArrayStringified = JSON.stringify(newArray);
      localStorage.setItem(
        cartItem[i].getAttribute("data-id"),
        newArrayStringified
      );

      changeOnInput();
    });
  }
};
// permet d'utiliser sumprice et sumquantity
const changeOnInput = async () => {
  const productsData = await retrieveProductsData();
  sumPrice(productsData);
  sumQuantity(productsData);
};

// attends les données de l'api pour les fournir à fillCart & sumprice
const mainCart = async () => {
  const productsData = await retrieveProductsData();
  console.log(productsData);
  fillCart(productsData);
};
mainCart();
changeOnInput();
