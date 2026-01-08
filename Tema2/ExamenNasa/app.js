import {AsteroidService} from "./service/AsteroidService.js";
import {AsteroidView} from "./view/AsteroidView.js";
import { getDates, getSelectValues } from './assets/js/dates.js';

(async () => {
    try {

        document.addEventListener('DOMContentLoaded', () => {
            const dateSelect = document.getElementById('dates');

            const datesArray = getDates();

            datesArray.forEach(dateObj => {
                const option = document.createElement('option');
                option.value = dateObj.value;
                option.textContent = dateObj.label;

                dateSelect.appendChild(option);
            });

            // --- Optional: Logic for the "Cerca" button using getSelectValues ---
            const searchButton = document.getElementById('cerca');
            searchButton.addEventListener('click', () => {
                const selectedDates = getSelectValues(dateSelect);
                console.log("Dates selected:", selectedDates);
                // Here you would add the logic to filter the asteroids table
            });
        });


        const asteroidView  = new AsteroidView();
        const asteroides = await AsteroidService.getAsteroids();
        console.log(asteroides);
        asteroidView.pintarAsteroides(asteroides);


    } catch (error) {
        console.error("Error al iniciar la app:", error);
    }
})();