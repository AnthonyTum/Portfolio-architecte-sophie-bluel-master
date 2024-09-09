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

        // Indique que l'utilisateur est connecté
        localStorage.setItem('isLoggedIn', 'true');

        // Redirection vers la page d'accueil après une connexion réussie
        window.location.href = 'index.html';

    } catch (error) {
        alert('Email ou mot de passe incorrect');
    }
});

window.onload = function() {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Sélectionner le lien dans la barre de navigation
    const loginLink = document.querySelector('nav li a[href="login.html"]');
    
    if (isLoggedIn === 'true') {
        // Si l'utilisateur est connecté, afficher "Log out" sur la page d'accueil
        loginLink.textContent = 'Log out';
        loginLink.setAttribute('href', '#'); // Empêche de rediriger vers la page de connexion
        
        // Gestion de la déconnexion lorsque "Log out" est cliqué
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Déconnexion : supprimer les informations du localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            
            // Redirection vers la page de connexion après déconnexion
            window.location.href = 'login.html';
        });
    }
};