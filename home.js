(function () {

    // get all the  elements for index html.
    const searchBtn = document.getElementById("searchBtn");
    const inputbar = document.getElementById("nameInput");
    const superHeroBox = document.getElementById("superHeroBox");
    const hamBar = document.getElementById("ham-bar");
    const mainHeading = document.getElementById("mainHeading");
    const notificationDiv = document.getElementById("notificationDiv");
  
  
    // showing notification when favourite button click.
    let notification = function (msg, state) {
        notificationDiv.innerHTML = msg;
        if (state == true) {
            notificationDiv.style.backgroundColor = "Green";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 1800)
        }
        else {
            notificationDiv.style.backgroundColor = "Blue";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 1800)
        }
    }
  //notification("testing message", true);
  
    // get array of favourite superhero from localStorage and create empty array when there is No favourite superhero.
    let superHeroIdList = [];
    // listFavSuperHero

    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdList = JSON.parse(stringOfSuperHeroId);
    }
  
    console.log(superHeroIdList);
  
  
    // hamburger menu for small size screen.
  
    hambutton.onclick = function () {
        if (hamBar.style.maxHeight == "0px" || hamBar.style.maxHeight == "") {
            hamBar.style.maxHeight = "40vh";
        }
        else {
            hamBar.style.maxHeight = "0px";
        }
    }
  
  
    // Create card for hero when rendering completed
    
    var getSuperHerocardLayout = function (id, name, sourceImg, ext) {
        console.log(id, name, sourceImg, ext);
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
        img.setAttribute("onerror", "this.onerror= null; this.src='assets/imgErr.jpg';");
  
        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
  
        var heroName = document.createElement("div");
        heroName.setAttribute("class", "heroName");
        heroName.innerHTML = name;
  
        var favBtnIcon = document.createElement("div");
        favBtnIcon.setAttribute("class", "favBtn");
  
  
        // if the superhero is in the list then color its  favourite Button
        // or else don't color the favourite button button 
        
        if (superHeroIdList.indexOf(id) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
        }
        else {
            favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
        }
  
        // function for adding and removig superhero in the favourite list
        
        favBtnIcon.onclick = function () {
            var index = superHeroIdList.indexOf(id);
            if (index !== -1) {
                console.log(id);
                superHeroIdList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
            }
            else {
                superHeroIdList.push(id);
                favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
                console.log(superHeroIdList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdList));
                notification(heroName.innerHTML + " Added to Favourites", 1);
            }
        }
  
        cardBody.appendChild(heroName);
        cardBody.appendChild(favBtnIcon);
  
        heroImageContainer.appendChild(img);
        cardLayout.appendChild(heroId);
        cardLayout.appendChild(heroImageContainer);
        cardLayout.appendChild(cardBody);
  
        // make sure the favourite button working when click else open that superhero page.
  
        cardLayout.onclick = function (event) {
            if (event.target.id === favBtnIcon.firstChild.id) {
                return;
            }
            else {
                window.open("superhero.html?hero_id=" + id, "_self");
            }
        }
        return cardLayout;
    }
  
  
  
    // render superheroes and if not shown empty error.
    let showHeroes = async function (data, name) {
       
        if (data == null) {
            superHeroBox.innerHTML = "";
            return;
        }
        if (inputbar.value !== name) {
            return;
        }
        superHeroBox.innerHTML = "";
        for (const i of data) {
            console.log(i.id, i.name, i.thumbnail.path, i.thumbnail.extension);
            superHeroBox.appendChild(getSuperHerocardLayout(i.id, i.name, i.thumbnail.path, i.thumbnail.extension));
        }
    }
  
  
    
    // rendered which body contain the characters entered in the input bar.
  
    inputbar.onkeyup = async function () {
        mainHeading.style.display = "none";
        let name = inputbar.value;
        if (name.length == 0) {
            superHeroBox.innerHTML = "";
            mainHeading.style.display = "block";
            return;
        }
        let response = await fetch(`https://gateway.marvel.com//v1/public/characters?nameStartsWith=${name}&ts=1&apikey=ad7128e532a29031b89d34b4c0d3190a&hash=7e964deabf100bcca48f4660c4e2af1e`).catch(e => {
                     console.log("error");
          });
        let res = await response.json();
        showHeroes(res.data.results, name);
        console.log(res.data.results[0], name); 


    }


  })();
  
  
  

