import {getDates} from "./assets/js/dates.js";
import {getSelectValues} from "./assets/js/dates.js";
import {MeteoService} from "./service/MeteoService.js";
import {MeteoView} from "./view/MeteoView.js";

(async () => {
    try {

        let current_page = 1;
        let MeteoData = [];
        const records_per_page = 5;

        const meteoservice = new MeteoService();

        document.addEventListener('DOMContentLoaded', () => {
            const dateSelect = document.getElementById('datesSelect');
            const searchButton = document.getElementById('searchBtn');

            const meteoView = new MeteoView();

            meteoView.actualitzarBotonsPaginacio(1, 0);

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
                    try {
                        MeteoData = await meteoservice.getWeatherApi();
                        console.log(MeteoData);
                        changePage(1);
                    } catch (error) {
                       meteoView.mostrarError();
                    }
                } else {
                    alert("Seleccione un valor");
                }
            });

            document.getElementById('prevBtn').addEventListener('click', () => {
                if (current_page > 1) {
                    current_page--;
                    changePage(current_page);
                }
            });

            document.getElementById('nextBtn').addEventListener('click', () => {
                if (current_page < numPages()) {
                    current_page++;
                    changePage(current_page);
                }
            });

            function numPages() {
                return Math.ceil(MeteoData.length / records_per_page);
            }

            function changePage(page) {
                if (page < 1) page = 1;
                if (page > numPages()) page = numPages();

                const start = (page - 1) * records_per_page;
                const end = page * records_per_page;
                const asteroidesPagina = MeteoData.slice(start, end);

                meteoView.pintarMeteo(asteroidesPagina);

                meteoView.actualitzarBotonsPaginacio(page, numPages());
            }

        });
    } catch{
    console.error("Error cargando obras cargando...");}

})();