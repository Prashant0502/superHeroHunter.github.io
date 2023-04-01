(function () {

   
    // get url from window location href
    // and use url params to get superhero id

    const url = new URL(window.location.href);
    var heroId = url.searchParams.get("hero_id");

    // get all the  element. 
    const heroImg = document.getElementById("mainHeroImage");
    const heroName = document.getElementById("heroName");
    const heroID = document.getElementById("heroId");
    const Comics = document.getElementById("heroComics");
    const Series = document.getElementById("heroSeries");
    const Stories = document.getElementById("heroStories");
    const Events = document.getElementById("heroEvent");
    const Discription = document.getElementById("heroDiscription");
    const favBtnIcon = document.getElementById("favBtn");
   
    

    // notification function for showing notification when favourite button clicked.
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


    // get array of favourite superheros from localStorage and create empty array when there is 0 favourite superhero.

    let superHeroIdList = [];

    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdList = JSON.parse(stringOfSuperHeroId);
    }

    //console.log(superHeroIdList);

    // function which show superhero data by calling other function
    const showHero = function (data) {
        heroImg.setAttribute("src", data.thumbnail.path+'.'+data.thumbnail.extension);
        heroName.innerHTML = data.name;
        heroID.innerHTML = data.id;
        Comics.innerHTML = data.comics.available;
        Series.innerHTML = data.series.available;
        Stories.innerHTML = data.stories.available;
        Events.innerHTML = data.events.available;

        if(data.description==""){
            Discription.innerHTML = "No Description Available";
        }else{
            Discription.innerHTML = data.description;  
        }
       
        
        
        

        if (superHeroIdList.indexOf(data.id) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
        }
        else {
            favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
        }


         // function for adding and removig superheros in the favourite list
        favBtnIcon.onclick = function () {
            var index = superHeroIdList.indexOf(data.id);
            if (index !== -1) {
                console.log(data.id);
                superHeroIdList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
            }
            else {
                superHeroIdList.push(data.id);
                favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
                console.log(superHeroIdList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
                notification(heroName.innerHTML + " Added to Favourites", 1);
            }
        }

    }
    

    // function to get superheros by id fetched from urlParams.
    const getHeroById = async function (heroId) {
        let response = await fetch(`https://gateway.marvel.com//v1/public/characters/${heroId}?&ts=1&apikey=ad7128e532a29031b89d34b4c0d3190a&hash=7e964deabf100bcca48f4660c4e2af1e`).catch(e => {
            console.log("error");
 });
        let res = await response.json();
        showHero(res.data.results[0]);
    }

    getHeroById(heroId);

})();