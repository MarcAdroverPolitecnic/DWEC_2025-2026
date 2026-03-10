// h) Servei — totes les crides a l'API
import Artwork from '../model/Artwork.js';

const BASE = 'https://theteacher.codiblau.com/public/exercicis/galeria';

export class GaleriaService {

    // Petició 1: categories
    static async getCategories() {
        const res = await fetch(`${BASE}/categories-list`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json(); // array de strings: ["Web", "Disseny", ...]
    }

    // Petició 2: llistat d'obres ordenades per data
    static async getArtworks() {
        const res = await fetch(`${BASE}/list`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();

        // Convertim a objectes Artwork i ordenem per data
        return data
            .map(item => new Artwork(item.id, item.titol, item.url, item.data, item.categoria))
            .sort((a, b) => new Date(a.data) - new Date(b.data));
    }

    // Petició 3: desar obra d'art
    static async saveArtwork(titol, url, data, categoria) {
        const res = await fetch(`${BASE}/save`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ titol, url, data, categoria })
        });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
    }
}
