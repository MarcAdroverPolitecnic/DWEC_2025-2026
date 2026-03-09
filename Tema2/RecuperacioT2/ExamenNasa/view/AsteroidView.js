export class AsteroidView {

    constructor() {
        // Guardem les referències als elements del DOM al crear la classe
        this.posar = document.getElementById('taula');
        this.btnAnterior = document.getElementById('anterior');
        this.btnSeguent = document.getElementById('seguent');
    }

    pintarAsteroides(asteroids) {
        // Netejem el contingut anterior
        this.posar.innerHTML = "";

        const taula = document.createElement('table');

        // --- CAPÇALERA ---
        const trHeader = document.createElement("TR");

        const thNom = document.createElement('TH');
        thNom.innerText = "NOM";

        const thDiametre = document.createElement('TH');
        thDiametre.innerText = "DIAMETRE";

        const thPerill = document.createElement('TH');
        thPerill.innerText = 'PERILL';

        trHeader.appendChild(thNom);
        trHeader.appendChild(thDiametre);
        trHeader.appendChild(thPerill);

        taula.appendChild(trHeader);

        // --- COS DE LA TAULA ---
        for (const asteroid of asteroids) {
            // Canvio el nom de la variable a 'trRow' perquè no es confongui amb la capçalera
            const trRow = document.createElement("TR");

            const tdNom = document.createElement('TD');
            tdNom.innerText = asteroid.name;

            const tdDiametre = document.createElement('TD');
            tdDiametre.innerText = asteroid.diameter;

            const tdPerill = document.createElement('TD');
            tdPerill.innerText = asteroid.perill;

            // Opcional: Donar format visual si és perillós
            if (asteroid.perill) {
                tdPerill.style.fontWeight = "bold";
                tdPerill.style.color = "red";
            }

            trRow.appendChild(tdNom);
            trRow.appendChild(tdDiametre);
            trRow.appendChild(tdPerill);

            taula.appendChild(trRow);
        }

        this.posar.appendChild(taula);
    }

    // --- MÈTODE PER GESTIONAR LA VISIBILITAT DELS BOTONS ---
    actualitzarBotonsPaginacio(paginaActual, totalPagines) {

        // 1. Gestionar botó ANTERIOR
        if (paginaActual === 1) {
            this.btnAnterior.style.visibility = "hidden";
        } else {
            this.btnAnterior.style.visibility = "visible";
        }

        // 2. Gestionar botó SEGÜENT
        // S'amaga si estem a l'última pàgina O si no hi ha resultats (totalPagines 0)
        if (paginaActual >= totalPagines || totalPagines === 0) {
            this.btnSeguent.style.visibility = "hidden";
        } else {
            this.btnSeguent.style.visibility = "visible";
        }
    }

    // Mètode extra per si falla la càrrega
    mostrarError() {
        this.posar.innerHTML = "<p style='color:red; text-align:center'>Hi ha hagut un error carregant les dades.</p>";
    }
}