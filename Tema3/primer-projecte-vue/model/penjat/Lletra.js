import lletra from "@/components/penjat/Lletra.vue";

export class Lletra {
    _lletra
    _estat

    /*
    * NO_SELECCIONAT
    * */

    constructor(lletra, estat) {
        this._lletra = lletra;
        this._estat = estat;
    }


    get lletra() {
        return this._lletra;
    }

    set lletra(value) {
        this._lletra = value;
    }

    get estat() {
        return this._estat;
    }

    set estat(value) {
        this._estat = value;
    }
}