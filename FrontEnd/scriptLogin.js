const formulaire = document.querySelector("form");
    
formulaire.addEventListener("submit", async function(event)
{
    event.preventDefault();
    const data = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=mdp]").value,
    };
    const chargeUtile = JSON.stringify(data);
    

    const res = await fetch('http://localhost:5678/api/users/login', 
    {
        method:'POST',
        headers: 
        { 
            'Content-Type': 'application/json' 
        },
        body: chargeUtile,
    })
    const dataRes = await res.json();

    if (dataRes.token != null) 
    {
        console.log(dataRes.token);
        window.localStorage.setItem("token", dataRes.token);
        document.location.href="index.html";
    }
    else
    {
        const pError = document.createElement('p');
        pError.innerText = "Erreur dans l'identifiant ou le mot de passe";
        pError.className = "error";
        formulaire.appendChild(pError);
    }
});      

