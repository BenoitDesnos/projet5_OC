/* <---------------------------------------------- const et variables --------------------------------------------------------------------> */

const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
const error = document.querySelector(" #firstName + p");
let firstName, lastName, address, city, email;
let regexText = /^[a-zA-Z_.-]*$/g;
let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
let regexCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/gi;
let regexAdress = /^[a-zA-Z0-9\s,'-]*$/gi;
/* <-------------------------------------------------------------------------------------------------------------------------------------------> */

/* <---------------------------------------------- Fonctions de verifications des inputs --------------------------------------------------------------------> */

const errorDisplay = (tag, message, valid) => {
  const container = document.getElementById(tag);
  const error = document.querySelector("#" + tag + " + p");

  if (!valid) {
    container.classList.add("error");
    error.textContent = message;
  } else {
    container.classList.remove("error");
    error.textContent = message;
  }
};

// verifie les conditions du prénom et retourne la variable seulement si conditions remplies
const firstNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("firstName", "Le prénom doit faire entre 2 et 20 caractères");
    firstName = null;
  } else if (!value.match(regexText)) {
    errorDisplay(
      "firstName",
      "Le prénom ne doit pas contenir de caractères spéciaux"
    );
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};
// verifie les conditions du nom et retourne la variable seulement si conditions remplies
const lastNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("lastName", "Le nom doit faire entre 2 et 20 caractères");
    lastName = null;
  } else if (!value.match(regexText)) {
    errorDisplay(
      "lastName",
      "Le nom ne doit pas contenir de caractères spéciaux"
    );
    console.log("test");
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
};
// verifie les conditions de l'email et retourne la variable seulement si conditions remplies
const emailChecker = (value) => {
  if (!value.match(regexEmail)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};

// verifie les conditions de l'adresse et retourne la variable seulement si conditions remplies
const addressChecker = (value) => {
  if (!value.match(/^[a-zA-Z0-9\s,'-]*$/gi)) {
    errorDisplay(
      "address",
      "L'adresse ne peut pas contenir de caractères spéciaux autre que le point, la virgule ainsi que le tiret central."
    );
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
};

// verifie les conditions de la ville et retourne la variable seulement si conditions remplies
const cityChecker = (value) => {
  if (!value.match(regexCity)) {
    errorDisplay("city", "Saisir un nom de ville Ex :Saint-jean-de-vedas");
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
};

/* <-------------------------------------------------------------------------------------------------------------------------------------------> */

/* <---------------------------------------------------------------EventListeners----------------------------------------------------------------> */

// lance chaque fonction de verification selon l'input que nous utilisons
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "lastName":
        lastNameChecker(e.target.value);
        break;
      case "firstName":
        firstNameChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      case "address":
        addressChecker(e.target.value);
        break;
      case "city":
        cityChecker(e.target.value);
        break;
      default:
        null;
    }
  });
});

// envoie les données au serveur back au click sur commander
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // verifie si aucun item n'est présent dans le localStorage
  if (localStorage.getItem(localStorage.key(0)) == null) {
    alert("Veuillez selectionner au moins un article avant de commander !");
    document.location.href = `index.html`;
  }
  // si au moins un item présent nous rentrons dans la condition du else suivant
  else {
    // verifie si les values ont bien été retournées par les fonctions de verifications, les fonctions de verifications retourne une variable null si elle ne correspondent pas aux conditions. Nous verifions donc si elles ne sont PAS null.
    if (firstName && lastName && address && city && email) {
      console.log(products);

      // values de chaque input dans le form.
      const contact = {
        firstName,
        lastName,
        address,
        city,
        email,
      };

      // objet contenant l'objet contact et l'array products contenant les ids présent dans le localStorage
      const formData = {
        contact,
        // products est initialisé dans cart.js dans la fonction productsIdWatch();
        products,
      };

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };
      // envoie les données au serveur.
      fetch("http://localhost:3000/api/products/order", options)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
          document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
          console.log("Erreur Fetch product.js", err);
          alert("Un problème a été rencontré lors de l'envoi du formulaire.");
        });

      alert("Commande validée !");
    }
    // sinon nous demandons de remplir correctment les champs
    else {
      alert("veuillez remplir correctement les champs");
    }
  }
});

/* <-------------------------------------------------------------------------------------------------------------------------------------------> */
