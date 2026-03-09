import AirQuality from "../model/AirQuality.js";

export class AirQualityService {

    static async cerca(date, latitude, longitude) {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,european_aqi&start_date=${date}&end_date=${date}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();

        const { time, pm10, pm2_5, european_aqi } = data.hourly;

        return time.map((t, i) => new AirQuality(t, pm10[i], pm2_5[i], european_aqi[i]));
    }
}
