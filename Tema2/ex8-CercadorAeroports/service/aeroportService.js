import {Aeroport} from "../model/aeroport.js";

export class AeroportService {
    async findAll() {
        const aeroportFetch = await fetch("https://theteacher.codiblau.com/public/exercicis/airports");
        const aeroport = await aeroportFetch.json();
        return aeroport.map(a => this.#conversioAeroport(a));

    }

    #conversioAeroport(json) {
        return new Aeroport(
            json.code,
            json.name,
            json.lat,
            json.lon,
            json.city);
    }

     async filter(aeroports, txt){
        if(!txt){
            return aeroports;
        }

        let aeroportsResult = aeroports;
        if(!aeroportsResult){
            aeroportsResult = await this.findAll();
        }

        return aeroportsResult.filter(a=>a.nom && a.nom.toLowerCase().includes(txt.toLowerCase()));
    }

}