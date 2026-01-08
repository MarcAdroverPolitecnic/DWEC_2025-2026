import Asteroid from "../model/Asteroid.js";

export class AsteroidService {
    static async getAsteroids(date) {
        const res = await fetch(
            `https://theteacher.codiblau.com/public/exercicis/nasa?date=${date}`
        );
        const data = await res.json();

        return data.map(item => new Asteroid(
            item.asteroid_name,
            item.asteroid_diameter_mm,
            item.asteroid_esperillos
        ));
    }
}
