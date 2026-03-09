import { AirQualityService } from './service/AirQualityService.js';
import { AirQualityView }    from './view/AirQualityView.js';
import { getDates, getSelectValues } from './assets/js/dates.js';

// Ex6: IIFE - s'executa automàticament quan carrega el DOM
(async () => {

    // --- Variables d'estat ---
    const RECORDS_PER_PAGE = 5;
    let allData    = [];
    let firstDateRecords = []; // Per al gràfic (Ex7)
    let currentPage = 1;
    let latitude  = 39.5696;  // Per defecte: Barcelona (fins Ex5)
    let longitude = 2.6502;

    // --- Inicialitzar vista ---
    const view = new AirQualityView();
    view.actualitzarPaginacio(1, 0);

    // --- Ex1: Carregar dates al select ---
    const datesSelect = document.getElementById('datesSelect');
    getDates().forEach(date => {
        const opt = document.createElement('option');
        opt.value = date;
        opt.textContent = date;
        datesSelect.appendChild(opt);
    });

    // --- Ex5: Geolocation API ---
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                latitude  = pos.coords.latitude;
                longitude = pos.coords.longitude;
                view.mostrarMissatge(`Ubicació detectada: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            },
            () => {
                view.mostrarMissatge('Ubicació no disponible. S\'usen coordenades per defecte.');
            }
        );
    }

    // --- Botons de paginació ---
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; changePage(currentPage); }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < numPages()) { currentPage++; changePage(currentPage); }
    });

    // --- Botó de cerca ---
    document.getElementById('searchBtn').addEventListener('click', async () => {
        const selectedDates = getSelectValues(datesSelect);
        if (selectedDates.length === 0) {
            alert('Selecciona almenys una data.');
            return;
        }

        view.mostrarMissatge('Carregant...');

        try {
            // Ex3: Múltiples peticions amb Promise.all
            const results = await Promise.all(
                selectedDates.map(date => AirQualityService.cerca(date, latitude, longitude))
            );

            // Combinar tots els resultats en un sol array pla
            allData = results.flat();

            // Guardar la primera data per al gràfic (Ex7)
            firstDateRecords = results[0] || [];

            currentPage = 1;
            changePage(1);
            view.mostrarMissatge(`${allData.length} registres trobats.`);

            // Ex7: Pintar gràfic amb les dades de la primera data
            view.pintarGrafic(firstDateRecords);

        } catch (err) {
            console.error(err);
            view.mostrarError();
        }
    });

    // --- Funcions de paginació ---
    function numPages() {
        return Math.ceil(allData.length / RECORDS_PER_PAGE);
    }

    function changePage(page) {
        if (page < 1) page = 1;
        if (page > numPages()) page = numPages();

        const start   = (page - 1) * RECORDS_PER_PAGE;
        const end     = page * RECORDS_PER_PAGE;
        const pagData = allData.slice(start, end);

        view.pintarFiles(pagData);
        view.actualitzarPaginacio(page, numPages());
    }

})();
