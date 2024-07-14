
$(document).ready(function () {
    $(".loading-screen").fadeOut(600, () => {
        $('body').removeClass('overflow-hidden');
    })
});
let navbtn = $("#navBtn")
let navbar = $("#navBar")
let content = $('#content');
let search = $('#search');
getSearchApi()
closeNav(
);
navbtn.on('click', () => {
    if (navbar.css('translate') == '0px') {
        closeNav();
    } else {
        openNav()
    }
})
function openNav() {
    navbtn.addClass('fa-x');
    navbtn.removeClass('fa-bars');
    navbar.animate({ translate: 0 }, 500)
    $(".yummy").animate({ translate: 0 }, 500)
    $(".nav-item").slideDown(500)
}
function closeNav() {
    navbtn.removeClass("fa-x");
    navbtn.addClass("fa-bars");
    navbar.animate({ translate: -220 }, 500)
    $(".yummy").animate({ translate: -200 }, 500)
    $(".nav-item").slideUp(500)
}
async function getSearchApi(name, s) {
    $(".loading-screen").fadeIn(300);
    $(".loading-screen").removeClass('ts').addClass('top-12');
    s = s ? s : 's';
    name = name ? name : '';
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${s}=${name}`)
    let data = await response.json();
    data = data.meals;
    data ? displayMeals(data) : displayMeals([]);
    $(".loading-screen").fadeOut(300);
    $(".loading-screen").removeClass('top-12').addClass('ts');

}
function displayMeals(arr) {
    let cont = ``;
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3 pt-5 z-1 ">
                            <div onclick='getDetalisApi(${arr[i].idMeal})' class="meal position-relative rounded-2 overflow-hidden ">
                                <img class="w-100"
                                    src="${arr[i].strMealThumb}" alt="#"
                                    srcset="">
                                <div class="meal-layer1 d-flex align-items-center position-absolute p-2 ">
                                    <h3>${arr[i].strMeal}</h3>
                                </div>
                            </div>
                        </div>`
    }
    content.html(cont)
}
async function getDetalisApi(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let data = await response.json();
    data = data.meals[0];
    diplayDetails(data)
    closeNav();
    search.addClass("d-none")
    $(".closedetails").click(function () {
        $(".hidedetails").addClass("d-none")
        getSearchApi()

    })
}
function diplayDetails(meal) {
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal['strMeasure' + i] && meal['strIngredient' + i]) {
            ingredients += `<li class='word text-info p-2 rounded-3 me-3 mb-3'>${meal['strMeasure' + i]} ${meal['strIngredient' + i]}</li>`;
        }
        else {
            break;
        }
    }
    let displayTag = ``;
    if (meal.strTags !== null) {
        let tags = meal.strTags.split(',');
        for (let i = 0; i < tags.length; i++) {
            displayTag += `<li class='alert-danger text-black p-2 rounded-3 me-3 mb-3'>${tags[i]}</li>`;
        }
    }
    let cont = `
    <div class="col-md-4 text-white hidedetails">
    <i class="fa-solid fa-x fs-3 text-white position-absolute end-0 top-0 closedetails"></i>
                        <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                            alt="">
                            <h2>${meal.strMeal}</h2>
                    </div>
                    <div class="col-md-8 text-white hidedetails">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                        <h3>Recipes :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${ingredients}
                        </ul>
        
                        <h3>Tags :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${displayTag}
                        </ul>
        
                        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>`
    content.html(cont);
}
$(".searchbutton").on("click", () => {
    content.html('')
    search.removeClass('d-none');
    $('#sbyname').val('');
    $('#sbyf').val('');
    closeNav();
})

$('#sbyname').on('keyup', () => {
    getSearchApi($('#sbyname').val());
})

$('#sbyf').on('keyup', () => {

    getSearchApi($('#sbyf').val(), 'f');
})
async function getCat() {
    content.html('');
    $(".loading-screen").fadeIn(300)
    search.addClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json()
    data = data.categories;
    displayCat(data);
    closeNav();
    $(".loading-screen").fadeOut(300)
}
function displayCat(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer1 position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }
    content.html(cont);
}
async function getCategoryMeals(type) {
    $(".loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${type}`);
    let data = await response.json();
    data = data.meals;
    closeNav();
    displayMeals(data);
    $(".loading-screen").fadeOut(300);
}
$('#cat').on('click', getCat);
async function getAApi(a, type, i) {
    content.html('');
    $(".loading-screen").fadeIn(300);
    search.addClass('d-none');
    let aoi;
    if (i) {
        aoi = 'i';
    }
    else {
        aoi = 'a'
    }
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/${type}${aoi}=${a}`);
    let data = await response.json();
    data = data.meals;
    if (type == 'filter.php?' && !i) {
        displayMeals(data);
    }
    else if (type == 'list.php?' && !i) {
        displayAreas(data);
    }
    else if (type == 'filter.php?' && i) {
        displayMeals(data.slice(0, 10));
    }
    else {
        displaying(data.slice(0, 10));
    }
    closeNav();
    $(".loading-screen").fadeOut(300);
}
function displayAreas(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div 'filter.php?')" class="rounded-2 nnn text-center cursor-pointer text-white">
                        <i class="fa-solid fa-house fa-4x"></i>
                        <h3 class='area'>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    content.html(cont);
}

function displaying(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div 'filter.php?','i')" class="rounded-2 text-center text-white nnn cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }
    content.html(cont);
}

$('#area').on('click', () => {
    getAApi('list', 'list.php?');
});


$('#ingred').on('click', () => {
    getAApi('list', 'list.php?', 'i');
});
function displayContact() {
    $('#search').addClass('d-none');
    let cont = `
    <div class="col-8 offset-2 position-relative  bg-black myy-5">
                        <div class="row g-4 bg-black">
                            <div class="col-md-6">
                                <input required  type="text" class="form-control " placeholder="Enter Your Name">
                            </div>
                            <div class="col-md-6">
                                <input required  type="email" class="form-control  " placeholder="Enter Your Email">
                            </div>
                            <div class="col-md-6">
                                <input required  type="text" class="form-control " placeholder="Enter Your Phone">
                            </div>
                            <div class="col-md-6">
                                <input required  type="number" class="form-control " placeholder="Enter Your Age">
                            </div>
                            <div class="col-md-6">
                                <input required  type="password" class="form-control " placeholder="Enter Your Password">
                            </div>
                            <div class="col-md-6">
                                <input required  type="password" class="form-control " placeholder="Repassword">
                            </div>
                            <button  class="btn btn-outline-danger btncon px-2 mt-3 position-absolute">Submit</button>
                        </div>
                    </div>`;
    closeNav()
    content.html(cont);
}

$('#contact').on('click', displayContact);
