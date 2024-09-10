// index.js
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }

        const data = await response.json();

        // Supposons que la réponse contient un token
        localStorage.setItem('authToken', data.token);

        // Redirection vers la page d'accueil après une connexion réussie
        window.location.href = 'index.html';

    } catch (error) {
        alert('Email ou mot de passe incorrect');
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    // Récupère le token d'authentification
    const authToken = localStorage.getItem("authToken");
  
    // Si l'utilisateur est connecté, affiche la barre de mode édition et le bouton "Modifier"
    if (authToken) {
        window.location.href = 'index.html';
    }
  
  
  
  });