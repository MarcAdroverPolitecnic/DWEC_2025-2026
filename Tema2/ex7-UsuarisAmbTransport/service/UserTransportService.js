import {Usuari} from '../model/usuari.js';
import {Transport} from '../model/transport.js';

export class UserTransportService {
    async findAll() {
        const usuarisFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/list");
        const usuaris = await usuarisFetch.json();
        const usuarisObject = usuaris.map(u => this.#clientToUsuari(u))
        const transports = await Promise.all(usuarisObject.map(u => u.transport));
        for (let i = 0; i < usuarisObject.length; i++) {
            usuarisObject[i].transport = transports[i];
        }

        return usuarisObject;
    }

    async getTransportById(id) {
        return fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/transport", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'idtransport=' + id
        }).then(x => x.json())
            .then(transport => this.#clientToTransport(transport));
    }

    #clientToTransport(json) {
        return new Transport(json.id, json.nom, json.url);
    }

    #clientToUsuari(json) {
        const tranport = this.getTransportById(json.transport_idtransport);
        return new Usuari(
            json.username,
            json.nom,
            json.cognom1 + ' ' + json.cognom2,
            tranport);
    }
}

/*

export async function findAll(){
    const usuarisFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/list");
    const usuaris = await usuarisFetch.json();
    return usuaris.map(u=>clientToUsuari(u));
}

export async function getTransportById(id){
    const transportFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/transport", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'idtransport='+id
        });

    const transport = await transportFetch.json();
    return clientToTransport(transport);
}

function clientToTransport(json){
    return new Transport(json.id, json.nom, json.url);
}

function clientToUsuari(json){
    return new Usuari(
        json.username,
        json.nom,
        json.cognom1 + ' ' + json.cognom2,
        null);
}

 */