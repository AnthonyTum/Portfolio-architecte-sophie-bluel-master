"use strict";

const galleryContainer = document.querySelector(".portfolio-gallery");
const categoriesContainer = document.querySelector(".categories");
const portfolioEdit = document.getElementById("portfolio-edit");

let currentCategory = "Tous";

// Récupère le token d'authentification
const authToken = localStorage.getItem("authToken");

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
async function deleteWork(workId) {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
}

async function openGalleryModal() {
  console.log(authToken);
  const modal = document.getElementById("gallery");
  const closeButton = document.getElementById("gallery-close");
  modal.classList.add("active");
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  });
  closeButton.addEventListener("click", function () {
    modal.classList.remove("active");
  });

  const works = await getWorks();
  const galleryPictures = document.getElementById("gallery-pictures");

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const divElement = document.createElement("div");
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "gallery-delete";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();

      await deleteWork(work.id);

      divElement.remove();

      const galleryImages = document.querySelectorAll(".portfolio-gallery img");
      for (let i = 0; i < galleryImages.length; i++) {
        if (galleryImages[i].src === work.imageUrl) {
          galleryImages[i].parentNode.remove();
        }
      }
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can";

    deleteButton.appendChild(deleteIcon);
    divElement.appendChild(imgElement);
    divElement.appendChild(deleteButton);
    galleryPictures.appendChild(divElement);
  }

  document
    .querySelector(".add-photo-button")
    .addEventListener("click", function () {
      openAddPhotoModal();
    });
}

// Fonction pour ouvrir le modale d'ajout de photo
function openAddPhotoModal() {
  const addPhotoModal = document.getElementById("add-photo");
  const closeAddPhotoModal = document.getElementById("add-photo-close");
  const returnGallery = document.getElementById("return-gallery");

  addPhotoModal.style.display = "block";

  closeAddPhotoModal.addEventListener("click", function () {
    addPhotoModal.style.display = "none";
  });

  returnGallery.addEventListener("click", function () {
    addPhotoModal.style.display = "none";
    document.getElementById("gallery").style.display = "block";
  });

  window.addEventListener("click", function (event) {
    if (event.target === addPhotoModal) {
      addPhotoModal.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  // Si l'utilisateur est connecté, affiche la barre de mode édition et le bouton "Modifier"
  if (authToken) {
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "Logout";
    loginLink.addEventListener("click", function (event) {
      event.preventDefault();

      // Déconnexion : supprimer les informations du localStorage
      localStorage.removeItem("authToken");
      window.location.href = "index.html";
      loginLink.textContent = "Log in";
    });
    console.log("Utilisateur connecté");
    const editMode = document.getElementById("edit-mode");

    // Affiche la barre de mode édition
    editMode.classList.add("active");

    // Affiche le bouton "Modifier" des projets
    portfolioEdit.classList.add("active");
    portfolioEdit.addEventListener("click", function (e) {
      e.preventDefault();
      openGalleryModal();
    });
  }

  displayCategories();
  displayWorks();
});
