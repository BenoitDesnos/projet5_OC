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

// utilise les données de l'api pour remplir la page des produits
const fillProductsTable = (productsData) => {
  //crée le contenu html pour chaque produit présent dans productsData
  const productsBlock = productsData.map((product) => {
    let a = document.createElement("a"); //
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    let article = document.createElement("article");
    a.appendChild(article);
    a.setAttribute("href", `/front/html/product.html?id=${product._id}`);
    article.append(img, h3, p);
    img.setAttribute("src", `${product.imageUrl}`);
    img.setAttribute("alt", `${product.altTxt}`);
    img.setAttribute("alt", `${product.altTxt}`);
    h3.textContent = product.name;
    h3.setAttribute("class", `productName`);
    p.textContent = product.description;
    p.setAttribute("class", `productDescription`);
    return a;
  });

  // ajoute toutes les balises <a> que productsBlock retourne
  items.append(...productsBlock);
  console.log(productsBlock);
  console.log("test");
};

// attends les données de l'api pour les fournir à fillProductsData
const main = async () => {
  const productsData = await retrieveProductsData();
  console.log(productsData);

  fillProductsTable(productsData);
};
main();
