import {AsteroidService} from "./service/AsteroidService.js";
import {AsteroidView} from "./view/AsteroidView.js";
import { getDates, getSelectValues } from './assets/js/dates.js';

(async () => {
    try {
        let current_page = 1;
        const records_per_page = 5;
        let allAsteroidsData = [];

        document.addEventListener('DOMContentLoaded', () => {
            const dateSelect = document.getElementById('dates');
            const searchButton = document.getElementById('cerca');

            // Instanciem la vista (ara ja agafa els botons al constructor)
            const asteroidView = new AsteroidView();

            // Inicialitzem l'estat dels botons (pàgina 1 de 0)
            asteroidView.actualitzarBotonsPaginacio(1, 0);

            // ... (Codi per omplir el select es manté igual) ...
            const datesArray = getDates();
            datesArray.forEach(dateObj => {
                const option = document.createElement('option');
                option.value = dateObj.value;
                option.textContent = dateObj.label;
                dateSelect.appendChild(option);
            });

            searchButton.addEventListener('click', async () => {
                const selectedValues = getSelectValues(dateSelect);

                if (selectedValues.length > 0) {
                    const dataTriada = selectedValues[0];
                    try {
                        allAsteroidsData = await AsteroidService.getAsteroids(dataTriada);
                        current_page = 1;
                        changePage(1);
                    } catch (error) {
                        console.error(error);
                        asteroidView.mostrarError(); // Deleguem l'error a la vista també
                    }
                } else {
                    alert("Seleccione un valor");
                }
            });

            // Els listeners fan servir els botons, però no en toquen l'estil
            document.getElementById('anterior').addEventListener('click', () => {
                if (current_page > 1) {
                    current_page--;
                    changePage(current_page);
                }
            });

            document.getElementById('seguent').addEventListener('click', () => {
                if (current_page < numPages()) {
                    current_page++;
                    changePage(current_page);
                }
            });

            function numPages() {
                return Math.ceil(allAsteroidsData.length / records_per_page);
            }

            function changePage(page) {
                // Validacions lògiques (Math)
                if (page < 1) page = 1;
                if (page > numPages()) page = numPages();

                // Càlcul de dades (Data Slicing)
                const start = (page - 1) * records_per_page;
                const end = page * records_per_page;
                const asteroidesPagina = allAsteroidsData.slice(start, end);

                // --- AQUI ESTÀ LA MILLORA ---
                // 1. Pintem la taula
                asteroidView.pintarAsteroides(asteroidesPagina);

                // 2. Diem a la vista que actualitzi l'estat dels botons
                asteroidView.actualitzarBotonsPaginacio(page, numPages());
            }
        });

    } catch (error) {
        console.error("Error al iniciar la app:", error);
    }
})();