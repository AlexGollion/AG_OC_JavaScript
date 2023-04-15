// Fonction pour afficher dynamiquement les projets 
function genererSet(set)
{
    let setIter = set.values();
    for (let i = 0; i<set.size; i++)
    {
        let works = setIter.next().value;
        const figureElement = document.createElement("figure");
                
        const imageElement = document.createElement("img");
        imageElement.src = works.imageUrl;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = works.title;
    
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
    
        const divGallery = document.querySelector(".gallery");
        divGallery.appendChild(figureElement);
    }
}

// Fonction pour se déconnecter
const disconnect = function(e)
{
    e.preventDefault();
    //On vide le local storage puis on recharge la page 
    window.localStorage.clear();
    location.reload();
}

// Permet d'afficher la page en mode édition
function modifPage()
{
    // On change le login en logout pour pouvoir se déconnecter
    const logout = document.querySelectorAll("a");
    logout[0].innerText = "logout";
    logout[0].addEventListener('click', disconnect);

    // On modifie le header
    const divEdit = document.createElement("div");
    divEdit.className = "admin";
    const pEdit = document.createElement("p");
    pEdit.innerText = "Mode édition";
    const btnEdit = document.createElement("button");
    btnEdit.innerText = "Publier les changements";
    const iconEdit = document.createElement("i");
    iconEdit.className = "fa-regular fa-pen-to-square";
    divEdit.appendChild(iconEdit);
    divEdit.appendChild(pEdit);
    divEdit.appendChild(btnEdit);
    const header = document.querySelector("header");
    header.appendChild(divEdit);

    // On enlève les filtres pour les projets
    const portfolio = document.querySelector("#portfolio");
    const filtre = document.querySelector("#ulFiltre");
    portfolio.removeChild(filtre);

    // On créer le premier lien pour ouvrir la modal
    const section = document.createElement("section");
    section.className = "projet";
    const titre = document.querySelectorAll("h2");
    const aProjet = document.createElement("a");
    const iconProjet = document.createElement("i");
    iconProjet.className = "fa-regular fa-pen-to-square";
    aProjet.innerText = "modifier";
    aProjet.href = "#modal";
    aProjet.className = "js-modal";
    section.appendChild(titre[1]);
    section.appendChild(iconProjet);
    section.appendChild(aProjet);
    portfolio.prepend(section);

    // On créer le second lien pour ouvrir la modal
    const img = document.querySelector("figure");
    const iconModif = document.createElement("i");
    iconModif.className = "fa-regular fa-pen-to-square";
    const figcaption = document.createElement("figcaption");
    const aIntro = document.createElement("a");
    aIntro.innerText = "modifier";
    aIntro.href = "#modal";
    aIntro.className = "js-modal";
    figcaption.appendChild(iconModif);
    figcaption.appendChild(aIntro);
    img.appendChild(figcaption);
}

// Variable qui sert pour la création de la modal
let modalVar = null;

// Permet d'ouvrir la modal
const openModal = function (e)
{
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", 'true');
    modalVar = target;
    modalVar.addEventListener('click', closeModal); 
    modalVar.querySelector('.js-close-modal').addEventListener('click', closeModal);
    modalVar.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    const section = document.querySelector(".projet");
    section.removeAttribute("class");
    section.className = "js-temp";
}

// Permet de fermer la modal
const closeModal = function (e)
{
    console.log(modalVar);
    if (modalVar === null) return;
    e.preventDefault();
    modalVar.style.display = "none";
    modalVar.setAttribute("aria-hidden", "true");
    modalVar.removeAttribute('aria-modal');
    modalVar.removeEventListener('click', closeModal);
    modalVar.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modalVar.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    const section = document.querySelector(".js-temp");
    section.removeAttribute("class");
    section.className = "projet";
    modalVar = null;
}

const stopPropagation = function (e)
{
    e.stopPropagation();
}

// On ajoute aux liens la fonction permettant d'ouvrir la modal
function eventModal()
{
    document.querySelectorAll('.js-modal').forEach(a => 
        {
            a.addEventListener('click', openModal);
        })
}

// Affiche l'image du projet à ajouter 
const afficherImage = function(e)
{
    e.preventDefault();
    const div = document.querySelector('.div-file');
    const img = document.createElement('img');
    console.log(e.target.files[0]);
    img.src = URL.createObjectURL(e.target.files[0]);
    worksImage = e.target.files[0];
    img.id = "preview";
    div.innerHTML = "";
    div.appendChild(img);
}

// Variable qui sert à l'ajout d'un projet
var worksImage;

// Permet d'ajouter un projet
const validWorks = async function (e)
{
    e.preventDefault();
    // On prépare les données à envoyer 
    const form = new FormData();
    form.append('image', worksImage);
    form.append('title', document.querySelector("#inTitle").value);
    form.append('category', document.querySelector("#categorie").value);

    // On récupère le token
    const token = window.localStorage.getItem('token');

    const res = await fetch('http://localhost:5678/api/works',
    {
        method: 'POST',
        headers:
        {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
        },
        body: form,
    })

    const data = await res.json()
    if (data.id == null)
    {
        alert("Erreur, pas d'image, de titre ou de catégorie");   
    } 
}

// Afficher le formulaire d'ajout des projets
const addWorks = function (e)
{
    e.preventDefault();
    const title = document.querySelector("#titleModal");
    title.innerText = "Ajout photo";
    const divAside = document.querySelector('.modal-wrapper');
    const divImg = document.querySelector('.modal-img');
    const btnSuppr = document.querySelector('#btn-suppr');
    divAside.removeChild(divImg);
    const divBtn = document.querySelector('.modal-button');
    divBtn.removeChild(btnSuppr);

    // Ajout du boutton pour valider l'ajout
    const btnValid = document.querySelector('#btn-ajout');
    btnValid.innerText = "Valider";
    btnValid.type = "submit"; 
    btnValid.removeEventListener('click', addWorks);
    btnValid.addEventListener('click', validWorks);

    // On ajoute la flêche pour revenir en arrière
    const iReturn = document.createElement('i');
    iReturn.className = "fa-solid fa-arrow-left fa-1x";
    iReturn.addEventListener('click', function()
    {
        const divAside = document.querySelector('aside');
        btnValid.removeEventListener('click', validWorks);
        divAside.innerHTML = "";
        createModal();
    })

    const form = document.createElement('form');

    // Création de la partie du formulaire correspondant au choix de l'image
    const divAjout = document.createElement('div');
    divAjout.className = "div-file";
    const iconImg = document.createElement('i');
    iconImg.className = "fa-solid fa-image fa-5x";
    const labelAjout = document.createElement('label');
    labelAjout.innerText = "+ Ajouter photo";
    const inAjout = document.createElement('input');
    inAjout.id = "ajout";
    inAjout.name = "ajout";
    inAjout.type = "file";
    inAjout.accept = "image/png, image/jpg";
    inAjout.maxLength = "4000";
    inAjout.addEventListener('change', afficherImage);
    const pAjout = document.createElement('p');
    pAjout.innerText = "jpg, png: 4mo max";
    labelAjout.appendChild(inAjout);
    divAjout.appendChild(iconImg);
    divAjout.appendChild(labelAjout);
    divAjout.appendChild(pAjout);

    // Création du reste du formulaire
    const labelTitle = document.createElement('label');
    labelTitle.innerText = "Titre";
    const inTitle = document.createElement('input');
    inTitle.type = "text";
    inTitle.id = "inTitle";
    inTitle.name = 'title';
    const labelCat = document.createElement('label');
    labelCat.innerText = "Catégorie";
    const selectCat = document.createElement('select');
    selectCat.name = "categorie";
    selectCat.id = "categorie";
    const categorie = JSON.parse(window.localStorage.getItem('catégorie'));
    const option = document.createElement('option');
    option.value = "";
    option.innerText = "";
    selectCat.appendChild(option);
    for(let i = 0; i<categorie.length; i++)
    {
        const option = document.createElement('option');
        option.value = categorie[i].id;
        option.innerText = categorie[i].name;
        selectCat.appendChild(option);
    }
    
    // On ajoute au formulaire
    form.appendChild(divAjout);
    form.appendChild(labelTitle);
    form.appendChild(inTitle);
    form.appendChild(labelCat);
    form.appendChild(selectCat);

    divAside.removeChild(divBtn);
    divAside.appendChild(iReturn);
    divAside.appendChild(form);
    divAside.appendChild(divBtn);
}

// Permet de supprimer un projet
const deleteWorks = async function(e)
{
    e.preventDefault();
    // On récupère le token et l'id du projet
    const token = window.localStorage.getItem('token');
    const id = this.getAttribute('id');
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: 
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
        },
    })
    .then(response => {
        console.log('Delete successful');
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
    

}

// Créer le modal
function createModal()
{
    const divAside = document.createElement('div');
    divAside.className = 'modal-wrapper js-modal-stop';
    const iClose = document.createElement('i');
    iClose.className = "fa-solid fa-xmark js-close-modal";
    const title = document.createElement('h1');
    title.innerText = "Galerie photo";
    title.id = "titleModal";
    divAside.appendChild(iClose);
    divAside.appendChild(title);

    const divImg = document.createElement('div');
    divImg.className = "modal-img";

    // On récupère tous les projets depuis le local storage et on en créé un set
    const setArr = JSON.parse(window.localStorage.getItem('setTous'));
    const set = new Set(setArr);
    let setIter = set.values();
    // On ajoute chaque projet à la modal
    for (let i = 0; i<set.size; i++)
    {
        let works = setIter.next().value;
        const figureElement = document.createElement("figure");
                
        const imageElement = document.createElement("img");
        imageElement.src = works.imageUrl;
        // Ajout de l'icon de suppression et la fonction pour supprimer un projet
        const iElement = document.createElement("i");
        iElement.className = "fa-solid fa-trash-can";
        iElement.addEventListener('click', deleteWorks);
        iElement.id = works.id;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = "éditer";
    
        figureElement.appendChild(imageElement);
        figureElement.appendChild(iElement);
        figureElement.appendChild(figcaptionElement);
    
        divImg.appendChild(figureElement);

        const blockAside = document.querySelector('aside');
        blockAside.appendChild(divAside);
    }

    // On ajoute les bouttons pour ajouter un projet
    const divBtn = document.createElement('div');
    divBtn.className = "modal-button";
    const btnAjout = document.createElement('button');
    btnAjout.innerText = "Ajouter une photo";
    btnAjout.id = "btn-ajout";
    btnAjout.addEventListener('click', addWorks);
    const btnSuppr = document.createElement('button');
    btnSuppr.innerText = "Supprimer la galerie";
    btnSuppr.id = "btn-suppr";
    divBtn.appendChild(btnAjout);
    divBtn.appendChild(btnSuppr);

    divAside.appendChild(divImg);
    divAside.appendChild(divBtn);

    divAside.addEventListener('click', stopPropagation)
}

fetch('http://localhost:5678/api/works')
    .then(resWorks => 
        {
            resWorks.json().then(dataWorks =>
                {
                    // On instancie les sets 
                    const setObjets = new Set();
                    const setAppartements = new Set();
                    const setHotel = new Set();
                    const setTous = new Set();

                    fetch('http://localhost:5678/api/categories')
                        .then(resCat =>
                            {
                                resCat.json().then(dataCat =>
                                {   
                                    window.localStorage.setItem("catégorie", JSON.stringify(dataCat));
                                    // On ajoute chaque projet au set correspondant à sa catégorie
                                    for (let i = 0; i<dataWorks.length; i++)
                                    {
                                        if (dataWorks[i].categoryId == dataCat[0].id) setObjets.add(dataWorks[i]);
                                        
                                        if (dataWorks[i].categoryId == dataCat[1].id) setAppartements.add(dataWorks[i]);

                                        if (dataWorks[i].categoryId == dataCat[2].id) setHotel.add(dataWorks[i]);

                                        setTous.add(dataWorks[i]);
                                    }

                                    // On met le set avec tous les projets dans le local storage
                                    const setArr = Array.from(setTous);
                                    window.localStorage.setItem('setTous', JSON.stringify(setArr));
                                               
                                    // On ajoute l'event listener correspondant à chaque boutton
                                    const bouttonTous = document.querySelector("#tous");
                                    bouttonTous.addEventListener("click", function ()
                                    {
                                        document.querySelector(".gallery").innerHTML = "";
                                        genererSet(setTous);
                                    })

                                    const bouttonObjets = document.querySelector("#objets");
                                    bouttonObjets.addEventListener("click", function ()
                                    {
                                        document.querySelector(".gallery").innerHTML = "";
                                        genererSet(setObjets);
                                    })

                                    const bouttonAppartements = document.querySelector("#appartements");
                                    bouttonAppartements.addEventListener("click", function ()
                                    {
                                        document.querySelector(".gallery").innerHTML = "";
                                        genererSet(setAppartements);
                                    })

                                    const bouttonHotels = document.querySelector("#hotels");
                                    bouttonHotels.addEventListener("click", function ()
                                    {
                                        document.querySelector(".gallery").innerHTML = "";
                                        genererSet(setHotel);
                                    })


                                    bouttonTous.click();
                                    bouttonTous.focus();

                                    // On récupère le token via le local storage
                                    const token = window.localStorage.getItem('token');

                                    // Si on est connecter alors il y a un token dans le local storage sinon token sera null
                                    if (token != null)
                                    {
                                        // On créer la page on mode édition
                                        modifPage();
                                        eventModal();
                                        createModal();
                                    } 
                                    
                                })
                            })

                })  
        })
