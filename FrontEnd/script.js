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

function modifPage()
{
    const logout = document.querySelectorAll("a");
    logout[0].innerText = "logout";
    console.log(logout[0]);

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
    console.log(header);
    header.appendChild(divEdit);

    const portfolio = document.querySelector("#portfolio");
    const filtre = document.querySelector("#ulFiltre");
    portfolio.removeChild(filtre);

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

let modalVar = null;

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
const closeModal = function (e)
{
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

function eventModal()
{
    document.querySelectorAll('.js-modal').forEach(a => 
        {
            a.addEventListener('click', openModal);
        })
}

function createModal(set)
{
    const divAside = document.querySelector('.modal-wrapper');
    const divImg = document.createElement('div');
    divImg.className = "modal-img";

    let setIter = set.values();
    for (let i = 0; i<set.size; i++)
    {
        let works = setIter.next().value;
        const figureElement = document.createElement("figure");
                
        const imageElement = document.createElement("img");
        imageElement.src = works.imageUrl;
        const iElement = document.createElement("i");
        iElement.className = "fa-solid fa-trash-can";
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = "éditer";
    
        figureElement.appendChild(imageElement);
        figureElement.appendChild(iElement);
        figureElement.appendChild(figcaptionElement);
    
        divImg.appendChild(figureElement);
    }

    const divBtn = document.createElement('div');
    divBtn.className = "modal-button";
    const btnAjout = document.createElement('button');
    btnAjout.innerText = "Ajouter une photo";
    btnAjout.id = "btn-ajout";
    const btnSuppr = document.createElement('button');
    btnSuppr.innerText = "Supprimer la galerie";
    btnSuppr.id = "btn-suppr";
    divBtn.appendChild(btnAjout);
    divBtn.appendChild(btnSuppr);

    divAside.appendChild(divImg);
    divAside.appendChild(divBtn);
}

fetch('http://localhost:5678/api/works')
    .then(resWorks => 
        {
            resWorks.json().then(dataWorks =>
                {
                    const setObjets = new Set();
                    const setAppartements = new Set();
                    const setHotel = new Set();
                    const setTous = new Set();

                    fetch('http://localhost:5678/api/categories')
                        .then(resCat =>
                            {
                                resCat.json().then(dataCat =>
                                {   
                                    for (let i = 0; i<dataWorks.length; i++)
                                    {
                                        if (dataWorks[i].categoryId == dataCat[0].id) setObjets.add(dataWorks[i]);
                                        
                                        if (dataWorks[i].categoryId == dataCat[1].id) setAppartements.add(dataWorks[i]);

                                        if (dataWorks[i].categoryId == dataCat[2].id) setHotel.add(dataWorks[i]);

                                        setTous.add(dataWorks[i]);
                                    }
                                                        
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
                                    //window.localStorage.clear();
                                    bouttonTous.click();
                                    bouttonTous.focus();
                                    const token = window.localStorage.getItem('token');
                                    if (token != null)
                                    {
                                        modifPage();
                                        eventModal();
                                        createModal(setTous);
                                    } 
                                    
                                })
                            })

                })  
        })
