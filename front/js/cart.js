const cartItems = document.getElementById("cart__items");

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

const fillCart = (products) => {
  products.forEach((product) => {
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i));
      let itemStored = localStorage.getItem(localStorage.key(i));
      let itemStoredParsed = JSON.parse(itemStored);
      console.log(itemStoredParsed[0]);
      if (product._id === itemStoredParsed[0]) {
        cartItems.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${itemStoredParsed[2]}">
    <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
    <h2>${product.name}</h2>
    <p>${itemStoredParsed[2]}</p>
    <p>${product.price} €</p>
    </div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : ${itemStoredParsed[1]} </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemStoredParsed[1]}">
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    `;
      }
    }
  });
};
const mainCart = async () => {
  const productsData = await retrieveProductsData();
  console.log(productsData);

  fillCart(productsData);
};
mainCart();
