// h) Model — representa una obra d'art
export default class Artwork {
    constructor(id, titol, url, data, categoria) {
        this.id        = id;
        this.titol     = titol;
        this.url       = url;
        this.data      = data;
        this.categoria = categoria;
    }
}
