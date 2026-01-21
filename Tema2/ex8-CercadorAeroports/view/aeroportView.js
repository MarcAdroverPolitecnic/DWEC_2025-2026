
export class AeroportView{
    pintarAeroports(aeroports){

        const app = document.querySelector('#app');

        const table = document.createElement('TABLE');
        const trHeader = document.createElement("TR");

        const thCode = document.createElement('TH');
        thCode.innerText = "CODI";

        const thName = document.createElement('TH');
        thName.innerText = "NOM";

        const thLatitud = document.createElement('TH');
        thLatitud.innerText = 'LATITUD';

        const thLongitud = document.createElement('TH');
        thLongitud.innerText = 'LONGITUD';

        const thCiutat = document.createElement('TH');
        thCiutat.innerText = 'CIUTAT';

        trHeader.appendChild(thCode);
        trHeader.appendChild(thName);
        trHeader.appendChild(thLatitud);
        trHeader.appendChild(thLongitud);
        trHeader.appendChild(thCiutat);

        table.appendChild(trHeader);

        for(const aeroport of aeroports){
            const trHeader = document.createElement("TR");
            const tdCode = document.createElement('TD');
            tdCode.innerText = aeroport.codi;

            const tdNom = document.createElement('TD');
            tdNom.innerText = aeroport.nom;

            const tdLatitud = document.createElement('TD');
            tdLatitud.innerText = aeroport.latitud;

            const tdLongitud = document.createElement('TD');
            tdLongitud.innerText = aeroport.longitud;

            const tdCiutat = document.createElement('TD');
            tdCiutat.innerText = aeroport.ciutat;

            trHeader.appendChild(tdCode);
            trHeader.appendChild(tdNom);
            trHeader.appendChild(tdLatitud);
            trHeader.appendChild(tdLongitud);
            trHeader.appendChild(tdCiutat);

            table.appendChild(trHeader);
        }

        app.appendChild(table);

    }

    pintarMapa(aeroports){
        const app = document.querySelector('#app');

        const mapDiv = document.createElement('div');
        mapDiv.id = "map";
        mapDiv.style.height= '600px';

        app.appendChild(mapDiv);

        //Operar damunt el mapa
        var map = L.map('map').setView([39.616667, 2.983333], 8);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let i = 0;
        for(const aeroport of aeroports){
            if(i <= 100){
                var marker = L.marker([aeroport.latitud, aeroport.longitud]).addTo(map);
            }
            i++;
        }
    }

     pintarInput(callbackFiltrar, aeroports){
        const app = document.querySelector('#app');
        const input = document.createElement('input');
        input.addEventListener('input', async function(esdeveniment){
            const valor = esdeveniment.target.value;
            const aeroportsFiltrats = await callbackFiltrar(aeroports, valor);
            this.pintarAeroports(aeroportsFiltrats);
            this.pintarMapa(aeroportsFiltrats);
        }.bind(this));
        app.appendChild(input);
    }

}