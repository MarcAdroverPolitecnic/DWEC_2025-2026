import {Lletra} from "../../model/penjat/Lletra.js";

export class LletraService {
    initAbecedari(){
        const abecedari = "abcdefghijklmnopqrstuvwxyz".split("");
        return abecedari.map(lletra => new Lletra(lletra, "NO_SELECCIONAT"));
    }
}