export class UserTransportView{
    pintarUsuaris(usuaris){
        console.log("Usuaris pintat", usuaris)

        const app = document.querySelector('#app');
        const table = document.createElement('TABLE');
        const trHeader = document.createElement("TR");
        const thUsername = document.createElement('TH');
        thUsername.innerText = "Nom d'usuari";

        const thCognoms = document.createElement('TH');
        thCognoms.innerText = "Cognoms";

        const thTransport = document.createElement('TH');
        thTransport.innerText = 'Transport';

        trHeader.appendChild(thUsername);
        trHeader.appendChild(thCognoms);
        trHeader.appendChild(thTransport);

        table.appendChild(trHeader);

        for(const usuari of usuaris){
            const trHeader = document.createElement("TR");
            const tdUsername = document.createElement('TD');
            tdUsername.innerText = usuari.username;

            const tdCognoms = document.createElement('TD');
            tdCognoms.innerText = usuari.cognoms;

            const tdTransport = document.createElement('TD');
            tdTransport.innerText = usuari.transport.nom;

            const imgTransport = document.createElement('IMG');
            imgTransport.src = usuari.transport.url;

            trHeader.appendChild(tdUsername);
            trHeader.appendChild(tdCognoms);
            trHeader.appendChild(tdTransport);
            trHeader.appendChild(imgTransport);

            table.appendChild(trHeader);
        }

        app.appendChild(table);

    }
}