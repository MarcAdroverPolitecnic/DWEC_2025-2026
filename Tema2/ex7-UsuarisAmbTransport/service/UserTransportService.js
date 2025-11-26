import {User} from "../model/usuari.js";
import {Transport} from "../model/transport.js";

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
}