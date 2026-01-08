export class AsteroidView {
    pintarAsteroides(asteroids){

        const posar = document.getElementById('taula');
        posar.innerHTML = "";
        const taula = document.createElement('table');

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

        for(const asteroid of asteroids){
            const trHeader = document.createElement("TR");
            const tdNom = document.createElement('TD');
            tdNom.innerText = asteroid.name;

            const tdDiametre = document.createElement('TD');
            tdDiametre.innerText = asteroid.diameter;

            const tdPerill = document.createElement('TD');
            tdPerill.innerText = asteroid.perill;

            trHeader.appendChild(tdNom);
            trHeader.appendChild(tdDiametre);
            trHeader.appendChild(tdPerill);

            taula.appendChild(trHeader);
        }

        posar.appendChild(taula);
    }}