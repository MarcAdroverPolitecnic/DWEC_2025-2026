import {User} from "../model/usuari.js";
import {Transport} from "../model/transport.js";

export class UserTransportService {

    async findAll(){
        const usuari = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/list");
        const usuaris = await usuari.json();
        return usuaris.map(u=>this.#clientToUsuari(u));
    }

    async getTransportById(id){
        const transportFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/transport?", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: 'idtransport=' + id
        });

        const transport = await transportFetch.json();
        return this.#clientToTransport(transport);
    }

    #clientToUsuari(json){
        const transport = this.getTransportById(json.transport_idtransport);
        return new User(
            json.username,
            json.nom,
            json.cognom1 + ' ' + json.cognom2,
            transport);
    }
    #clientToTransport(json){
        return new Transport(
            json.id,
            json.nom,
            json.url);
    }


}
/*
export async function findAll(){
    const usuari = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/list");
    const usuaris = await usuari.json();
    return usuaris.map(u=>clientToUsuari(u));
}

export async function getTransportById(id){
    const transportFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/other/usuaris/transport?idtransport=1", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });

    const transport = await transportFetch.json();
    return clientToTransport(transport);
}

function clientToUsuari(json){
    return new User(
        json.username,
        json.nom,
        json.cognom1 + ' ' + json.cognom2,
        null);
}

function clientToTransport(json){
    return new Transport(
        json.id,
        json.nom,
        json.url);
}*/