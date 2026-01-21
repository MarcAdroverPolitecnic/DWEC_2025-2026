/*
export function Usuari(username, nom, cognoms, transport){
    this.username = username;
    this.nom = nom;
    this.cognoms = cognoms;
    this.transport = transport;
}
*/

export class Usuari{
    #username;
    #nom;
    #cognoms;
    #transport;

    constructor(username, nom, cognoms, transport) {
        this.#username = username;
        this.#nom = nom;
        this.#cognoms = cognoms;
        this.#transport = transport;
    }

    get username(){
        return this.#username
    }

    get nom() {
        return this.#nom;
    }

    set nom(value) {
        this.#nom = value;
    }

    get cognoms() {
        return this.#cognoms;
    }

    set cognoms(value) {
        this.#cognoms = value;
    }

    get transport() {
        return this.#transport;
    }

    set transport(value) {
        this.#transport = value;
    }
}