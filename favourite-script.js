(function () {

    // fetch all the required dom element.
    const superHeroBox = document.getElementById("superHeroBox");
    const containerEmptyDiv = document.getElementById("nothing-here");
    
    
    
    let superHeroIdList = []; //array used for the  localStorage
     //try to fetch data from local storage
    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdList = JSON.parse(stringOfSuperHeroId);
    }

    // if localStorage does not have any value then return and show message.

    if (superHeroIdList.length == 0) {
        containerEmptyDiv.style.display = "block";
        return;
    }

    let showError = function () {
        if (superHeroIdList.length == 0) {
            containerEmptyDiv.style.display = "block";
            return;
        }
    }



    // create a function for notificationing/notification by fetching notification div

    const notificationDiv = document.getElementById("notificationDiv");

    let notification = function (msg, state) {
        notificationDiv.innerHTML = msg;
        if (state == true) {
            notificationDiv.style.backgroundColor = "green";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 1500)
        }
        else {
            notificationDiv.style.backgroundColor = "red";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 1500)
        }
    }

    // console.log(superHeroIdList);



    // Create card for superhero when rendering complete
    var getSuperHerocardLayout = function (sourceImg, ext, name, id) {
        var cardLayout = document.createElement("div");
        cardLayout.setAttribute("class", "card-layout");

        var heroId = document.createElement("div");
        heroId.setAttribute("class", "hero-id");
        heroId.innerHTML = id;

        var heroImageContainer = document.createElement("div");
        heroImageContainer.setAttribute("class", "heroImageContainer");

        var img = document.createElement("img");
        img.setAttribute("class", "hero-image");
        img.setAttribute("src", sourceImg+'.'+ext);
        img.setAttribute("onerror", "this.src='/assets/imgErr.jpg';");

        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        var heroName = document.createElement("div");
        heroName.setAttribute("class", "heroName");
        heroName.innerHTML = name;

        var favBtnIcon = document.createElement("div");
        favBtnIcon.setAttribute("class", "favBtn");


        // if local storage have the id then color red the favourite icon.
        if (superHeroIdList.indexOf(id) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
        }
      
        // the local data Storage(favourite list).
        
        favBtnIcon.onclick = function () {
            var index = superHeroIdList.indexOf(id);
            if (index !== -1) {
                console.log(id);
                superHeroIdList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdList);
                superHeroBox.removeChild(cardLayout);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
                showError();
            }
        }

        cardBody.appendChild(heroName);
        cardBody.appendChild(favBtnIcon);



        heroImageContainer.appendChild(img);
        cardLayout.appendChild(heroId);
        cardLayout.appendChild(heroImageContainer);
        cardLayout.appendChild(cardBody);

        // make sure  favourite button working when click  and remove it from local storage else open that superhero page.

        cardLayout.onclick = function (event) {
            console.log(event.target, favBtnIcon);
            if (event.target.id === favBtnIcon.firstChild.id) {
                return;
            }
            else {
                window.open("superhero.html?hero_id=" + id, "_self");
            }
        }
        return cardLayout;
    }



    //  function for rendering superhero

    let showHeroes = async function (data) {
        let it = data
        superHeroBox.appendChild(getSuperHerocardLayout(it.thumbnail.path, it.thumbnail.extension, it.name, it.id));
    }

    //  Load favourite by id function
    let loadFavourites = async function (id) {

        let response = await fetch(`http://gateway.marvel.com//v1/public/characters/${id}?ts=1&apikey=ad7128e532a29031b89d34b4c0d3190a&hash=7e964deabf100bcca48f4660c4e2af1e`).catch(e => {
            console.log("error");
 });
        let res = await response.json();
        showHeroes(res.data.results[0]);
    }

    // looping over the superhero list and passing one by one to load favourites method.
    for (const iterator of superHeroIdList) {
        loadFavourites(iterator);
    }

})();