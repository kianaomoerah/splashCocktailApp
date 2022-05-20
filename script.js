
//Create object to house app 
const cocktailsApp = {};

//save relevant API information
cocktailsApp.apiURLRandom = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
cocktailsApp.apiDrinkIdList = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
// should be ex. i=vodka
cocktailsApp.apiDrinkDetails = "https://thecocktaildb.com/api/json/v1/1/lookup.php?"; // should be ex. i=11007


//Query DOM for inputs -- may need to move them down
const form = document.querySelector('form');

// console.log(form, surpriseMeBtn);

cocktailsApp.init = () => {
    cocktailsApp.displayRandomCocktail();
};

cocktailsApp.displayRandomCocktail = ( ) => {
    const surpriseMeBtn = document.querySelector('#surpriseMeBtn');

    surpriseMeBtn.addEventListener('click', function() {
        fetch(cocktailsApp.apiURLRandom)
        .then((response) => { return response.json(); })
        .then((randomDrinkObject) => {
            console.log(randomDrinkObject);
            //strDrink
            //strIngredient 1, 2, 3...
                //the value that matches strIngredient[1], match strMeasure[1]
            // strInstructions

            const drinkName = randomDrinkObject.drinks[0].strDrink
            console.log(drinkName);
            const drinkInstructions = randomDrinkObject.drinks[0].strInstructions
            console.log(drinkInstructions);
            const drinkImage = randomDrinkObject.drinks[0].strDrinkThumb
            console.log(drinkImage)
            const resultsList = document.querySelector(".results");

            const drinkObject = randomDrinkObject.drinks[0]
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
                    const measurementValue = drinkObject[measurement];

                    // function hasMeasurement(valueOfMeasurement) {
                    //     if (valueOfMeasurement === true) {
                    //         return valueOfMeasurement
                    //     }
                    // }

                    const finalValue = `${measurementValue} ${value}`;
                    ingredientsAndMeasurementList.push(finalValue);

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
             `;

            resultsList.append(liElement);


            //element.slice (13) -- so long as we don't include an end, it should give us what's left

            // with null values removed
            const drinkIngredientsObject = {}
            const entries = Object.entries(drinkObject)
            for (const [key,value] of entries) {
                if(value) {
                    drinkIngredientsObject[key] = value
                }
            }
            console.log(drinkIngredientsObject)


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
        })
    })
};


cocktailsApp.init ();

//======================================================

// RANDOM



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



