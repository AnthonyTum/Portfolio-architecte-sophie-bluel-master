document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);

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
        window.location.href = 'index.html'; // Remplacez par votre véritable page d'accueil

    } catch (error) {
        alert('Email ou mot de passe incorrect');
    }
});
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
        window.location.href = 'index.html';
    }