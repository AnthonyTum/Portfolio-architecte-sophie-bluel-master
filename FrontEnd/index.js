"use strict";

const galleryContainer = document.querySelector(".gallery");

const categoriesContainer = document.querySelector(".categories");

let currentCategory = "Tous";

async function getCategories() {
  return await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => data);
}

async function getWorks() {
  return await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => data);
}

function handleClickCategory(event) {
  const button = event.target;
  const buttonName = button.textContent;

  currentCategory = buttonName;

  categoriesContainer.childNodes.forEach((categoryButton) => {
    categoryButton.className = "category";
  });

  button.className = `category active`;

  updateWorks();
}

async function displayCategories() {
  const categories = await getCategories();
  const editedCategories = [...categories, { id: 0, name: "Tous" }];

  editedCategories
    .sort((a, b) => a.id - b.id)
    .forEach((category) => {
      const button = document.createElement("button");
      button.className = `category ${
        currentCategory === category.name ? "active" : ""
      }`;
      button.textContent = category.name;
      button.addEventListener("click", handleClickCategory);
      categoriesContainer.appendChild(button);
    });
}

async function updateWorks() {
  galleryContainer.innerHTML = "";

  const works = await getWorks();
  const filteredWorks = works.filter((work) => {
    return currentCategory === "Tous" || work.category.name === currentCategory;
  });

  filteredWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    galleryContainer.appendChild(figure);
  });
}

async function displayWorks() {
  const works = await getWorks();

  // Parcourir les works
  works.forEach((work) => {
    // Créer un élément figure
    const figure = document.createElement("figure");

    // Créer un élément img
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Créer un élément figcaption
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    // Ajouter l'image et le figcaption à la figure
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajouter la figure à la galerie
    galleryContainer.appendChild(figure);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  // Récupère le token d'authentification
  const authToken = localStorage.getItem("authToken");

  // Si l'utilisateur est connecté, affiche la barre de mode édition et le bouton "Modifier"
  if (authToken) {
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "Log out";
    loginLink.addEventListener("click", function (event) {
      event.preventDefault();

    // Déconnexion : supprimer les informations du localStorage
    localStorage.removeItem("authToken");
    loginLink.textContent = "Log in";
    });
    console.log("Utilisateur connecté");
    const editMode = document.getElementById("edit-mode");
    const portfolioEdit = document.getElementById("portfolio-edit");

    // Affiche la barre de mode édition
    editMode.classList.add("active");

    // Affiche le bouton "Modifier" des projets
    portfolioEdit.classList.add("active");
  }



displayCategories();
displayWorks();
});
  