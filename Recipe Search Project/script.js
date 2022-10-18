document.addEventListener('DOMContentLoaded',function(){
    //variables lets us add a 'click' event listener to the search button
    let search_button = document.querySelector("#search");
    let input = document.getElementById("input");

    //Used for API call
    const app_id = "b31e7135";
    const API_key = "786b08f450719fc8c50d24289d336e87";

    //makes it so pizza appears by deafult
    const default_search = "pizza"
    call_API(app_id, API_key, default_search)

    //when the user hits search this function runs and makes the API call
    search_button.addEventListener("click",function(){
        document.getElementById("content_area").style.display="flex";
        document.querySelector("#error").style.display = "none"
        input = document.getElementById("input");
        input_value = input.value

        call_API(app_id, API_key, input_value)
    });
    
    //if the user hits enter white still using the seach bar it makes a API call
    input.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            document.getElementById("content_area").style.display="flex";
            document.querySelector("#error").style.display = "none"
            input = document.getElementById("input");
            input_value = input.value
            call_API(app_id, API_key, input_value)
        }
    })

    
});


//makes the API call
function call_API(app_id, API_key, input_value){
    fetch(`https://api.edamam.com/search?app_id=${app_id}&app_key=${API_key}&q=${input_value}`) //can use 10000 calls/month
        .then(response => response.json())
        .then(data =>{
            console.log(data);
            use_data(data);
        })
 }

//this function uses the data from the API call and then displays it on the cards.
function use_data(data){
    let card_num = 1;

    if(data.hits.length === 0){//displays a message if the API dosen't return a dish
        document.getElementById("content_area").style.display="none";
        document.querySelector("#error").style.display = "block"
        document.querySelector("#error").innerHTML="Dish not found :("
    }

    for(let i=0;i<data.hits.length;i++){//The API returns an array of recipes and the for loop displays a card for each recipe in the proper div
        let cals = Math.floor(data.hits[card_num-1].recipe.calories)

        let list = " ";
        //this loop creates a HTML list with the ingredients array inside of it. It is then put inside an ordered list in the accordion. It creates a new list for each card.
        for(let j=0;j<data.hits[card_num-1].recipe.ingredients.length;j++){
            list += `<li>${data.hits[card_num-1].recipe.ingredients[j].text}</li>`;
        }

            //This displays the HTML below inside the cards. Everything you see on the cards will be from the code below. It looks messy bc. it was copied form bootstrap :)
            document.querySelector(`#content-${card_num}`).innerHTML=`
            <div class="card col-3 offset-1" style="width: 18rem;">
            <img src="${data.hits[card_num-1].recipe.image}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${data.hits[card_num-1].recipe.label}</h5>
            <p class="card-text">Calories: ${cals}</p>
            </div>

        <!--Accordion part that displays the ingridents. It's inside a list because it looks nicer that way with the bootstrap card I used.-->
        <!-- I had to use card_num beside collapse (line 61,63,67) to let the accordions open and close individually-->
            <ul class="list-group list-group-flush">
            <li class="list-group-item"><div class="accordion" id="accordionExample">
            <div class="accordion-item" id="accordion_content_${card_num}">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${card_num}" aria-expanded="false" aria-controls="collapse${card_num}">
                Ingredients
                </button>
            </h2>
            <div id="collapse${card_num}" class="accordion-collapse collapse" aria-labelledby="headingOne"
                <div class="accordion-body">
                    <ol id="item_list">
                        ${list}
                    </ol>
                </div>
            </div>
            </div></li>
            </ul>
        <!--Accordion ends -->

            <!--Link for real recipe-->
            <div class="card-body">
            <a href="${data.hits[card_num-1].recipe.url}" class="card-link">Recipe link</a>
            </div>
            </div>
             `

        card_num++;
    }
}
