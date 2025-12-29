export class UserTransportView{
    pintarUsuaris(usuaris){
        const app = document.querySelector("#app");
        const table = document.createElement("table");
        for (const user of usuaris){
            const trHeader = document.createElement("tr");

            const thUsername = document.createElement("th");
            thUsername.innerText = user.username;

            const thCognoms = document.createElement("th");
            thCognoms.innerText = user.surnames;

            const thTransport = document.createElement("th");
            thTransport.innerText = user.transport;

            trHeader.appendChild(thUsername);
            trHeader.appendChild(thCognoms);
            trHeader.appendChild(thTransport);
            table.appendChild(trHeader);
        }

        app.appendChild(table);
    }
}