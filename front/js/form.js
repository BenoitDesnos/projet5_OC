const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
const error = document.querySelector(" #firstName + p");

console.log(error);
let firstName, lastName, address, city, email;

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

const firstNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("firstName", "Le prénom doit faire entre 2 et 20 caractères");
    firstName = null;
  } else if (!value.match(/^[a-zA-Z_.-]*$/)) {
    errorDisplay(
      "firstName",
      "Le prénom ne doit pas contenir de caractères spéciaux"
    );
    console.log("test");
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};

const lastNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("lastName", "Le nom doit faire entre 2 et 20 caractères");
    lastName = null;
  } else if (!value.match(/^[a-zA-Z_.-]*$/)) {
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

const emailChecker = (value) => {
  if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};
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
const cityChecker = (value) => {
  if (!value.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/gi)) {
    errorDisplay("city", "Saisir un nom de ville Ex :Saint-jean-de-vedas");
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
};

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

const collectData = (e) => {
  e.preventDefault();
  if (firstName && lastName && address && city && email && products) {
    const contact = {
      firstName,
      lastName,
      address,
      city,
      email,
    };
    const formData = {
      contact,
      products,
    };
    console.log(formData);
    alert("Commande validée !");
    return formData;
  } else {
    alert("veuillez remplir correctement les champs");
  }
};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (firstName && lastName && address && city && email && products) {
    const contact = {
      firstName,
      lastName,
      address,
      city,
      email,
    };
    const formData = {
      contact,
      products,
    };

    const stringifiedData = JSON.stringify(formData);
    console.log(stringifiedData);
    postFunction(stringifiedData);

    alert("Commande validée !");
  } else {
    alert("veuillez remplir correctement les champs");
  }
});

async function postFunction(formData) {
  console.log(formData);
  await fetch("http://localhost:3000/api/products/order/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => console.log(data));

  await fetch("http://localhost:3000/api/products/order/")
    .then((res) => res.json())
    .then((data2) => {
      alert("stop");

      console.log(data2);
    })

    .catch((err) =>
      console.log(
        "Une erreur s'est produite sur la fonction retrieveProductsData ",
        err
      )
    );
}
