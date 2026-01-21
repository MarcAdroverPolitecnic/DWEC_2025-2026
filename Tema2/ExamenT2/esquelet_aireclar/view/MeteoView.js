export class MeteoView {

    constructor() {
        this.posar = document.getElementById('resultsBody');
        this.btnAnterior = document.getElementById('prevBtn');
        this.btnSeguent = document.getElementById('nextBtn');
    }

    pintarMeteo(meteos) {
        this.posar.innerHTML = "";

        const taula = document.createElement('table');

        const trHeader = document.createElement("TR");

        const thLatitude = document.createElement('TH');
        thLatitude.innerText = "Latitude";

        const thLongitude = document.createElement('TH');
        thLongitude.innerText = "Longitude";

        const thgenerationtime_ms = document.createElement('TH');
        thgenerationtime_ms.innerText = "GenerationTime_Ms";

        const thtimezone = document.createElement('TH');
        thtimezone.innerText = 'Timezone';

        const thutc_offset_seconds = document.createElement('TH');
        thutc_offset_seconds.innerText = 'UTC_OFFSET_SECONDS';

        const thtimezoneabreviation = document.createElement('TH');
        thtimezoneabreviation.innerText = 'Timezone Abreviation';

        const thelevation = document.createElement('TH');
        thelevation.innerText = 'Elevation';

        const thhourly_units = document.createElement('TH');
        thhourly_units.innerText = 'Hourly Units';

        trHeader.appendChild(thLatitude);
        trHeader.appendChild(thLongitude);
        trHeader.appendChild(thgenerationtime_ms);
        trHeader.appendChild(thtimezone);
        trHeader.appendChild(thutc_offset_seconds);
        trHeader.appendChild(thtimezoneabreviation);
        trHeader.appendChild(thelevation);
        trHeader.appendChild(thhourly_units);

        taula.appendChild(trHeader);

        for (const meteo of meteos) {
            const trRow = document.createElement("TR");

            const tdLatitude = document.createElement('TD');
            tdLatitude.innerText = meteo.latitude;

            const tdLongitude = document.createElement('TD');
            tdLongitude.innerText = meteo.longitude;

            const tdgenerationtime_ms = document.createElement('TD');
            tdgenerationtime_ms.innerText = meteo.generationtime_ms;

            const tdtimezone = document.createElement('TD');
            tdtimezone.innerText = meteo.timezone;

            const tdutc_offset_seconds = document.createElement('TD');
            tdutc_offset_seconds.innerText = meteo.utc_offset_seconds;

            const tdtimezoneabreviation = document.createElement('TD');
            tdtimezoneabreviation.innerText = meteo.timezone_abbreviation;

            const tdelevation = document.createElement('TD');
            tdelevation.innerText = meteo.elevation;

            const tdhourly_units = document.createElement('TD');
            tdhourly_units.innerText = meteo.hourly_units;


            trRow.appendChild(tdLatitude);
            trRow.appendChild(tdLongitude);
            trRow.appendChild(tdgenerationtime_ms);
            trRow.appendChild(tdtimezone);
            trRow.appendChild(tdutc_offset_seconds);
            trRow.appendChild(tdtimezoneabreviation);
            trRow.appendChild(tdelevation);
            trRow.appendChild(tdhourly_units);

            taula.appendChild(trRow);
        }

        this.posar.appendChild(taula);
    }

    actualitzarBotonsPaginacio(paginaActual, totalPagines) {

        if (paginaActual === 1) {
            this.btnAnterior.style.visibility = "hidden";
        } else {
            this.btnAnterior.style.visibility = "visible";
        }

        if (paginaActual >= totalPagines || totalPagines === 0) {
            this.btnSeguent.style.visibility = "hidden";
        } else {
            this.btnSeguent.style.visibility = "visible";
        }
    }

    mostrarError() {
        this.posar.innerHTML = "<p style='color:red; text-align:center'>Hi ha hagut un error carregant les dades.</p>";
    }

}