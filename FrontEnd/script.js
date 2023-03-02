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

                                    bouttonTous.click();
                                })
                            })

                })  
        })
