
//Create object to house app 
const cocktailsApp = {};

//save relevant API information  

cocktailsApp.apiURLRandom = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
cocktailsApp.apiDrinkIdList = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";
// should be ex. i=vodka
cocktailsApp.apiDrinkDetails = "https://thecocktaildb.com/api/json/v1/1/lookup.php?"; // should be ex. i=11007 


//Query DOM for inputs -- may need to move them down
const form = document.querySelector('form');

// console.log(form, surpriseMeBtn);

cocktailsApp.init = () => {
    cocktailsApp.displayRandomCocktail();
    cocktailsApp.displaySearchResults();
};

//TESTING adding search parameters ================================
// in tests online, the API doesn't seem to care what is capitalized or not

cocktailsApp.displaySearchResults = function () {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const urlSpirit = new URL(cocktailsApp.apiDrinkIdList);

        const inputElement = document.getElementById('spiritChoice');
        if (inputElement.value) {
            urlSpirit.search = new URLSearchParams({
                i: inputElement.value,
            });
            console.log(urlSpirit)

            fetch(urlSpirit)
                .then(results => {
                    return results.json();
                }).then(data => {
                    console.log(data);
                    cocktailsApp.displayDrinkDetails(data);
                })

        } else {
            throw new Error("Please enter a valid spirit")
        }

    })


}

//create function that will 
// take the ID of the drink
// fetch the details 
// display the final result of 10 options

cocktailsApp.displayDrinkDetails = function (drinksData) {

    // revisit making this a seperate function:
      //query for the UL
        const ulElement = document.querySelector('ul');

        //clear the UL before adding a new cocktail
        ulElement.innerHTML = '';

    //getting the drinks array
    let drinksArray = drinksData.drinks;
    // console.log(drinksArray);

    // take the ID of the drink
    drinksArray.forEach( function(drink) {
        const drinkId = drink.idDrink

        // console.log(drinkId);
        const urlDetails = cocktailsApp.apiDrinkDetails;
    
        const urlId = new URL (urlDetails)

        urlId.search = new URLSearchParams({
            i: drinkId
        });
        // console.log(urlId)
        
        fetch(urlId)
            .then(results => {
                return results.json();
            }).then(data => {
                cocktailsApp.getDrinkDetails(data);
        })
    });
}

cocktailsApp.getDrinkDetails = (cocktailObject) => {

    const drinkName = cocktailObject.drinks[0].strDrink
    const drinkInstructions = cocktailObject.drinks[0].strInstructions
    const drinkImage = cocktailObject.drinks[0].strDrinkThumb
    const resultsList = document.querySelector(".results")

    console.log(drinkName);

    const drinkObject = cocktailObject.drinks[0]
    console.log(drinkObject);


    //for storing the ingredients and measurements list
    const ingredientsAndMeasurementList = [];

    // isolate strIngredient items in the object that have content & matches them with their measurements
    for (let [key, value] of Object.entries(drinkObject)) {
        if ( key.includes("strIngredient") && value ) {

            //save key number in variable
            const ingredientKey = key.slice(13);
            console.log(ingredientKey);

            //get back strMeasurement[number] to match ingredient
            const measurement = `strMeasure` + ingredientKey;

            // get the value of that measurement (ex. 2 oz)
            const valueOfMeasurement = drinkObject[measurement];

            // Check if there is a measurement value and add it if there ione
            if (valueOfMeasurement) {
                const finalValue = ` ${valueOfMeasurement} ${value}`;
                ingredientsAndMeasurementList.push(finalValue);
            } else {
                const finalValue = ` ${value}`;
                ingredientsAndMeasurementList.push(finalValue);
            }


                }
            }
            console.log(ingredientsAndMeasurementList);
            //use the DOM to create an element to create a list
            const liElement = document.createElement('li');

            // creating a template literal that takes the number from the key and appends it on to the end of the strMeasurement variable to dynamically pull the measurement result
            liElement.innerHTML = `
                <img src = "${drinkImage}" alt="Cocktail photo of ${drinkName}" >
                <h2>${drinkName}</h2>
                <p>${ingredientsAndMeasurementList}</p>
                <p>${drinkInstructions}</p>
             `;

            resultsList.append(liElement);

}

// New function
// fetch the details of the array

//END TESTING adding search parameters ================================

cocktailsApp.displayRandomCocktail = ( ) => {
    const surpriseMeBtn = document.querySelector('#surpriseMeBtn');

    surpriseMeBtn.addEventListener('click', function() {

         //query for the UL
        const ulElement = document.querySelector('ul');

        //clear the UL before adding a new cocktail
        ulElement.innerHTML = '';

        fetch(cocktailsApp.apiURLRandom)
        .then((response) => { return response.json(); })
        .then((randomDrinkObject) => {
        cocktailsApp.getDrinkDetails(randomDrinkObject);

            // // adding names for all individual items from object we can grab immediately for the final array
            // const drinkName = randomDrinkObject.drinks[0].strDrink
            // const drinkInstructions = randomDrinkObject.drinks[0].strInstructions
            // const drinkImage = randomDrinkObject.drinks[0].strDrinkThumb
            // const resultsList = document.querySelector(".results")

            // console.log(drinkName);

            // const drinkObject = randomDrinkObject.drinks[0]
            // console.log(drinkObject);


            // //for storing the ingredients and measurements list
            // const ingredientsAndMeasurementList = [];

            // // isolate strIngredient items in the object that have content & matches them with their measurements
            // for (let [key, value] of Object.entries(drinkObject)) {
            //     if ( key.includes("strIngredient") && value ) {

            //         //save key number in variable
            //         const ingredientKey = key.slice(13);
            //         console.log(ingredientKey);

            //         //get back strMeasurement[number] to match ingredient
            //         const measurement = `strMeasure` + ingredientKey;

            //         // get the value of that measurement (ex. 2 oz)
            //         const valueOfMeasurement = drinkObject[measurement];

            //         // Check if there is a measurement value and add it if there is one
            //         if (valueOfMeasurement) {
            //             const finalValue = ` ${valueOfMeasurement} ${value}`;
            //             ingredientsAndMeasurementList.push(finalValue);
            //         } else {
            //             const finalValue = ` ${value}`;
            //             ingredientsAndMeasurementList.push(finalValue);
            //         }


            //     }
            // }
            // console.log(ingredientsAndMeasurementList);
            // //use the DOM to create an element to create a list
            // const liElement = document.createElement('li');

            // // creating a template literal that takes the number from the key and appends it on to the end of the strMeasurement variable to dynamically pull the measurement result
            // liElement.innerHTML = `
            //     <img src = "${drinkImage}" alt="Cocktail photo of ${drinkName}" >
            //     <h2>${drinkName}</h2>
            //     <p>${ingredientsAndMeasurementList}</p>
            //     <p>${drinkInstructions}</p>
            //  `;

            // resultsList.append(liElement);


            
        })
    })
};


cocktailsApp.init ();

//======================================================

// OLD CONTENT (GOOD IDEAS)

//element.slice (13) -- so long as we don't include an end, it should give us what's left

            // with null values removed
            // const drinkIngredientsObject = {}
            // const entries = Object.entries(drinkObject)
            // for (const [key,value] of entries) {
            //     if(value) {
            //         drinkIngredientsObject[key] = value
            //     }
            // }
            // console.log(drinkIngredientsObject)


            // const drinkIngredientsArray = object.entries(drinkIngredients)
            // console.log(drinkIngredientsArray);

            // const drinkIngredientsArray = Object.keys(drinkIngredients).filter((key) => key.includes("strIngredient")).reduce((obj, key) => {
            //     return Object.assign(obj, {
            //         [key]: drinkIngredients[key]
            //     });
            // });
            // console.log(drinkIngredientsArray);
            
            // drinkIngredients.filter((ingredient) => {
            //     if(ingredient) {return true;}
            // })



//TEST CONTENT
// cocktailsApp.getSearchedCocktails = () => {
//     // use the url constructor to specify the parameters to include in the API
//     const url = new URL(cocktailsApp.apiDrinkIdList);
//     url.search = new URLSearchParams({
//         i: 'vodka' //just putting in example for the sake of proving the API call is working - this would need to be generated dynamically using the prompt from the user in the final product
//     })
//     console.log(url); //shows us the created url is what we want
    
//     fetch(url)
//     .then((response) => { return response.json();})
//     .then((jsonResponse) => {
//         console.log(jsonResponse); //should display all drinks with vodka
//     })
// }




// ID Example
// cocktailsApp.getCocktailDetails = () => {
//     fetch(cocktailsApp.apiDrinkDetails)
//     .then((response) => {
//         return response.json();
//     })
//     .then((jsonResponse) => {
//         console.log(jsonResponse);

//     })
// }




