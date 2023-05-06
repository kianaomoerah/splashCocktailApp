
//Create object to house app 
const cocktailsApp = {};

//save relevant API information  
cocktailsApp.apiURLRandom = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
cocktailsApp.apiDrinkIdList = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";
cocktailsApp.apiDrinkDetails = "https://thecocktaildb.com/api/json/v1/1/lookup.php?";


// Query DOM
const form = document.querySelector('form');
const moreBtn = document.querySelector('.moreBtn');
const topAnchor = document.querySelector('.topAnchor');
const ulElement = document.querySelector('ul');

// For checking counts/array across functions
cocktailsApp.currentResults = [];
cocktailsApp.currentCount = 0;

cocktailsApp.init = () => {
    cocktailsApp.displayRandomCocktail();
    cocktailsApp.displaySearchResults();
    cocktailsApp.loadMoreDrinks();
};


// getting the ingredient search results ID's
cocktailsApp.displaySearchResults = function () {
    form.addEventListener('submit', function (event) {
         
        event.preventDefault();
        cocktailsApp.currentCount = 0;
        cocktailsApp.currentResults = [];
        topAnchor.classList.add('displayNone');
        moreBtn.classList.add('displayNone');
        moreBtn.classList.remove('displayBtn');

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
                    throw new Error('User entered invalid ingredient');
                }
            })
            .then((jsonData) => {

                // putting the fetched data into an object accessible outside of this function
                cocktailsApp.currentResults.push(...jsonData.drinks);
                // passing resulting object to check if it's more than 10 
                cocktailsApp.check10(cocktailsApp.currentResults);
            })
            .catch((err) => {
                cocktailsApp.drinkSearchError(err);
            })
    })

}


// Error function to run any time someone puts an invalid query in the input of the search
cocktailsApp.drinkSearchError = function(error) {


    ulElement.innerHTML = '';

    const liElement = document.createElement('li');

    liElement.innerHTML = `
                <h3>No drinks found</h3>
                <p>Please try searching again!</p>
            `;

    ulElement.append(liElement);

}


// Using the first API, have a maximum of 10 results shown initially, add the button to display more if the user wants
cocktailsApp.check10 = function (drinksObject) {

    if (drinksObject.length > 10) {

        cocktailsApp.currentCount = 10;

        cocktailsApp.getDrinkDetails(drinksObject.slice(0, 10));

        moreBtn.classList.remove('displayNone');
        moreBtn.classList.add('displayBtn');
        topAnchor.classList.remove('displayNone');

    } else {
        cocktailsApp.getDrinkDetails(drinksObject);
    }
}


// Add Event Listener to 'Display More' Button to display more items
cocktailsApp.loadMoreDrinks = function() {
    moreBtn.addEventListener('click', function() {

        if (cocktailsApp.currentResults.length - cocktailsApp.currentCount > 10) {

            // passing to getDrinkDetails in order to append new batch of 10 recipes to existing results on page
            cocktailsApp.getDrinkDetails(cocktailsApp.currentResults.slice(cocktailsApp.currentCount, cocktailsApp.currentCount + 10), true);
            cocktailsApp.currentCount += 10;
        } else {
            // passing to getDrinkDetails in order to append new batch of 10 recipes to existing results on page, and removing display more button as no more results exist
            moreBtn.classList.remove('displayBtn');
            moreBtn.classList.add('displayNone');
            cocktailsApp.getDrinkDetails(cocktailsApp.currentResults.slice(cocktailsApp.currentCount, cocktailsApp.currentCount + 10), true);
        }
    });
}


// Taking the 'drinksData' ID list from the first fetch, to:
    // create individual new links using the base API + the IDs
    // then fetching the information from those newly created links for the individual drink details information
    // passing the individual drink details information into the next function for isolating and appending the information we want to display
    // setting a default append value so it clears unless someone asks for more
cocktailsApp.getDrinkDetails = function (drinksArray, append = false) {

        if(!append) {
            ulElement.innerHTML = '';
        }

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
                cocktailsApp.displayDrinkDetails(data);
                
        })
    });
}


// Getting the details of each individual drink from the second API and displaying the name, image, and recipe
cocktailsApp.displayDrinkDetails = (cocktailObject) => {
    const drinkName = cocktailObject.drinks[0].strDrink
    const drinkInstructions = cocktailObject.drinks[0].strInstructions
    const drinkImage = cocktailObject.drinks[0].strDrinkThumb
    
    const drinkObject = cocktailObject.drinks[0]
  
    const ingredientsAndMeasurementList = [];

    for (let [key, value] of Object.entries(drinkObject)) {
        if ( key.includes("strIngredient") && value ) {

            //save key number in variable, get back strMeasurement[number], get value of measurement
            const ingredientKey = key.slice(13);
            const measurement = `strMeasure` + ingredientKey;
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
            
            // creating a template literal that takes the number from the key and appends it on to the end of the strMeasurement variable to dynamically pull the measurement result

            const liElement = document.createElement('li');

            liElement.innerHTML = `
                <img src = "${drinkImage}" alt="Cocktail photo of ${drinkName}" >
                <h3>${drinkName}</h3>
                <p><span class= "emphasisText">Ingredients:</span> ${ingredientsAndMeasurementList}</p>
                <p><span class= "emphasisText">Instructions:</span> ${drinkInstructions}</p>
            `;

            ulElement.append(liElement);

}


// supriseMeBtn to fetch a random drink from the API
cocktailsApp.displayRandomCocktail = ( ) => {
    const surpriseMeBtn = document.querySelector('#surpriseMeBtn');

    surpriseMeBtn.addEventListener('click', function() {

        ulElement.innerHTML = '';

        moreBtn.classList.remove('displayBtn');
        moreBtn.classList.add('displayNone');

        fetch(cocktailsApp.apiURLRandom)
        .then((response) => { return response.json(); })
        .then((randomDrinkObject) => {

        cocktailsApp.displayDrinkDetails(randomDrinkObject);
            
        })
    })
};


cocktailsApp.init ();




