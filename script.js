
//Create object to house app 
const cocktailsApp = {};

//save relevant API information  

cocktailsApp.apiURLRandom = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
cocktailsApp.apiDrinkIdList = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";
// should be ex. i=vodka
cocktailsApp.apiDrinkDetails = "https://thecocktaildb.com/api/json/v1/1/lookup.php?"; // should be ex. i=11007 


//Query DOM for inputs -- may need to move them down
const form = document.querySelector('form');


cocktailsApp.init = () => {
    cocktailsApp.displayRandomCocktail();
    cocktailsApp.displaySearchResults();
};

// getting the spirit search results ID's - these will then be passed to the displayDrinkDetails function to get the details of each drink
cocktailsApp.displaySearchResults = function () {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const urlSpirit = new URL(cocktailsApp.apiDrinkIdList);
        const inputElement = document.getElementById('spiritChoice');
        urlSpirit.search = new URLSearchParams({
            i: inputElement.value,
        });
        
        fetch(urlSpirit)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Other developers see this');
                }
            })
            .then((jsonData) => {
                // cocktailsApp.displayDrinkDetails(jsonData);
                // =========== CRUICAL - COMMENTED ABOVE OUT UNTIL check10 complete

                // passing resulting Drinks object to check if it's more than 10 
                cocktailsApp.check10(jsonData);
            })
            .catch((err) => {
                cocktailsApp.drinkSearchError(err);
                console.log(err);
            })
    })

}

// Error function to run any time someone puts an invalid query in the input of the search
cocktailsApp.drinkSearchError = function(error) {
    // revisit making this a seperate function:
    //query for the UL
    const ulElement = document.querySelector('ul');

    //clear the UL before adding a new cocktail
    ulElement.innerHTML = '';

    //use the DOM to create an element to create a list
    const liElement = document.createElement('li');

    // creating a template literal for a  simple error message
    liElement.innerHTML = `
                <h2>'No Drinks Found!'</h2>
                <p>Please try entering another spirit </p>
            `;

    ulElement.append(liElement);

}

// Using the first API, have a maximum of 10 resuls
    // Check if there are more than 10
    // if there are less than 10
    // pass the API results into the detDrinkDetails
    // if there are more than 10
    // choose 10 of those results
    // randomly pick those results

cocktailsApp.check10 = function (drinksObject) {

    if (drinksObject.drinks.length > 10) {

        let count = 0;
        const max10Result = [];
        while(count < 10) {
            max10Result.push(drinksObject.drinks[count]);
            count++;
        }

        cocktailsApp.displayDrinkDetails(max10Result);
        // Add function to reduce the number of drinks displayed and randmoize
    } else {

        cocktailsApp.displayDrinkDetails(drinksObject.drinks);
    }
}

// Taking the 'drinksData' ID list from the first fetch, to:
    // create individual new links using the base API + the IDs
    // then fetching the information from those newly created links for the individual drink details information
    // passing the individual drink details information into the next function for isolating and appending the information we want to display
cocktailsApp.displayDrinkDetails = function (drinksArray) {

    // revisit making this a seperate function:
      //query for the UL
        const ulElement = document.querySelector('ul');

        //clear the UL before adding a new cocktail
        ulElement.innerHTML = '';

    // take the ID of the drink
    drinksArray.forEach( function(drink) {
        const drinkId = drink.idDrink

        const urlDetails = cocktailsApp.apiDrinkDetails;
    
        const urlId = new URL (urlDetails)

        urlId.search = new URLSearchParams({
            i: drinkId
        });
        
        fetch(urlId)
            .then(results => {
                return results.json();
            }).then(data => {
                cocktailsApp.getDrinkDetails(data);
                
        })
    });
}




// Getting the details of each individual drink from the second API and displaying the name, image, and recipe
cocktailsApp.getDrinkDetails = (cocktailObject) => {
    const ulElement = document.querySelector('ul');
    const drinkName = cocktailObject.drinks[0].strDrink
    const drinkInstructions = cocktailObject.drinks[0].strInstructions
    const drinkImage = cocktailObject.drinks[0].strDrinkThumb
    
    const drinkObject = cocktailObject.drinks[0]
  
    //for storing the ingredients and measurements list
    const ingredientsAndMeasurementList = [];

    // isolate strIngredient items in the object that have content & matches them with their measurements
    for (let [key, value] of Object.entries(drinkObject)) {
        if ( key.includes("strIngredient") && value ) {

            //save key number in variable
            const ingredientKey = key.slice(13);

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
            //use the DOM to create an element to create a list
            const liElement = document.createElement('li');

            // creating a template literal that takes the number from the key and appends it on to the end of the strMeasurement variable to dynamically pull the measurement result
            liElement.innerHTML = `
                <img src = "${drinkImage}" alt="Cocktail photo of ${drinkName}" >
                <h2>${drinkName}</h2>
                <p>${ingredientsAndMeasurementList}</p>
                <p>${drinkInstructions}</p>
            `;

            ulElement.append(liElement);

}




// Listening for a click on the 'surprise me' button in order to fetch a random drink from the API
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




