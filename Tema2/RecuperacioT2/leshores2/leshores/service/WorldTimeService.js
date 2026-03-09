// Ex d) - Servei per obtenir l'hora d'un país via API del professor
export class WorldTimeService {

    static BASE_URL = 'https://theteacher.codiblau.com/exercicis/data';

    // Petició 1: Obté el JSON de tots els països { codi: nom, ... }
    static async getPaisos() {
        const res = await fetch(`${WorldTimeService.BASE_URL}/paisos`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json(); // { "ES": "Spain", "FR": "France", ... }
    }

    // Petició 2 (una crida): obté un sol valor (HOUR, MINUTE o SECOND) d'un país
    // Mètode POST amb application/x-www-form-urlencoded
    static async getWorldTime(codi, tipus) {
        const body = new URLSearchParams({ codi, tipus });
        const res = await fetch(`${WorldTimeService.BASE_URL}/worldtime`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:    body.toString()
        });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const text = await res.text();
        return parseInt(text); // retorna un número
    }

    // Fa les 3 cridades en paral·lel amb Promise.all
    // Quan acaben les 3, retorna { hour, minute, second }
    static async getFullTime(codi) {
        const [hour, minute, second] = await Promise.all([
            WorldTimeService.getWorldTime(codi, 'HOUR'),
            WorldTimeService.getWorldTime(codi, 'MINUTE'),
            WorldTimeService.getWorldTime(codi, 'SECOND'),
        ]);
        return { hour, minute, second };
    }
}
