let surname, nom, adress, city, email;

const textChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay("pseudo", "Le prénom/nom doit faire entre 2 et 20 caractères");
    surname = null;
    nom = null;
  } else if (!value.match(/^[a-zA-Z_.-]*$/)) {
    errorDisplay(
      "pseudo",
      "Le pseudo ne doit pas contenir de caractères spéciaux"
    );
    surname = null;
    nom = null;
  } else {
    errorDisplay("pseudo", "", true);
    pseudo = value;
  }
};

class Contact {
  constructor(surname, name, adress, city, email) {
    this.surname = surname;
    this.name = name;
    this.adress = adress;
    this.city = city;
    this.email = email;
  }
}
