const items = document.getElementById("items");
console.log(items);

// recupère les données situé dans l'api
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

// utilise les données de l'api
const fillProductsTable = (productsData) => {
  console.log("test");
  productsData.forEach((product) => {
    items.innerHTML += `<a href="/front/html/product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>`;
  });
};

// attends les données de l'api pour les fournir à fillProductsData
const main = async () => {
  const productsData = await retrieveProductsData();
  console.log(productsData);

  fillProductsTable(productsData);
};
main();
