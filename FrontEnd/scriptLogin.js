// On récupère le formulaire
const formulaire = document.querySelector("form");
    
// On ajoute au formulaire l'eventListener pour envoyer les données pour se connecter
formulaire.addEventListener("submit", async function(event)
{
    event.preventDefault();
    // On récupère les données de connexion à envoyer
    const data = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=mdp]").value,
    };
    const chargeUtile = JSON.stringify(data);
    
    // On fait un appel à l'API pour se connecter
    const res = await fetch('http://localhost:5678/api/users/login', 
    {
        method:'POST',
        headers: 
        { 
            'Content-Type': 'application/json' 
        },
        body: chargeUtile,
    })
    // On récupère les données renvoyer par l'API
    const dataRes = await res.json();

    // On regarde si l'API nous a renvoyer le token de connexion sinon il y a une erreur de connexion
    if (dataRes.token != null) 
    {
        window.localStorage.setItem("token", dataRes.token);
        document.location.href="index.html";
    }
    else
    {
        // On affiche un message d'erreur
        if (document.querySelector(".error") == null)
        {
            const pError = document.createElement('p');
            pError.innerText = "Erreur dans l'identifiant ou le mot de passe";
            pError.className = "error";
            formulaire.appendChild(pError);
        }
    }
});      

