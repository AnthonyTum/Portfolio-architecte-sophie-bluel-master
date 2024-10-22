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
  //modal.classList.add("active");
  modal.style.display = "block";
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      //modal.classList.remove("active");
      modal.style.display = "none";
    }
  });
  closeButton.addEventListener("click", function () {
    //modal.classList.remove("active");
    modal.style.display = "none";
  });

  const works = await getWorks();
  const galleryPictures = document.getElementById("gallery-pictures");
  galleryPictures.innerHTML = "";

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
  const addPhotoForm = document.getElementById("add-photo-form")
  const addPhotoModal = document.getElementById("add-photo");
  const uploadButton = document.querySelector(".upload-button");
  
  function closeAddPhotoModal() {
    addPhotoModal.style.display = "none";
        document.getElementById("preview-image").src = "./assets/icons/picture-svgrepo-com 1.png";
        uploadButton.style.display = "block";
        uploadFormat.style.display = "block";
        addPhotoForm.reset();

  
  }

// Fonction pour ouvrir le modale d'ajout de photo
async function openAddPhotoModal() {
  const closeAddPhotoModalButton = document.getElementById("add-photo-close");
  const returnGallery = document.getElementById("return-gallery");
  const categorySelect = document.getElementById("category");
  const categories = await getCategories();
  categorySelect.innerHTML = "";

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  }

  addPhotoModal.style.display = "block";
  document.getElementById("gallery").style.display = "none";
  addPhotoForm.addEventListener('input', function (event) {

  let field= event.target;
  console.log(field);

});

  closeAddPhotoModalButton.addEventListener("click", closeAddPhotoModal);


  uploadButton.addEventListener("click", function () {
    document.querySelector(".photo-upload-label").click();
  });

  returnGallery.addEventListener("click", function () {
    closeAddPhotoModal();
    document.getElementById("gallery").style.display = "block";
  });

  window.addEventListener("click", function (event) {
    if (event.target === addPhotoModal) {
      closeAddPhotoModal();

    }
  });
}


const uploadFormat= document.querySelector(".upload-format")
document.getElementById("photo-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("preview-image").src = event.target.result;
      uploadButton.style.display = "none";
      uploadFormat.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

document
  .getElementById("add-photo-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Récupérer les valeurs
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("photo-upload");
    const file = fileInput.files[0];
    console.log(title, category, file);
    // Vérifier si tous les champs sont remplis et l'image est sélectionnée
    if (title && category && file) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("image", file);
      console.log(formData);

      try {
        console.log(authToken);
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
        console.log("avantok");

        if (!response.ok) {
          throw new Error("Échec de l'ajout de la photo");
        }
        console.log(response);
        // Réinitialiser le formulaire après validation
        document.getElementById("add-photo-form").reset();
        document.getElementById("preview-image").src =
          "default-image-placeholder.png";

        alert("Photo ajoutée avec succès!");
        document.getElementById("add-photo").style.display = "none";
        document.getElementById("gallery").style.display = "block";
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'ajout de la photo.");
      }
    } else {
      alert("Tous les champs doivent être remplis.");
    }
  });

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
    categoriesContainer.style.display = "none";
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
