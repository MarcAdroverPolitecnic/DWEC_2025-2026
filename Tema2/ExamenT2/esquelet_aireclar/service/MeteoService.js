import Meteo from "../model/Meteo.js";

const params = {
    latitude: 39.431,
    longitude: 3.0194,
    hourly: ["pm10", "pm2_5", "european_aqi"],
    timezone: "America/Anchorage",
    start_date: "2026-01-02",
    end_date: "2026-01-02",
};

export class MeteoService {

     async getWeatherApi() {
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
        const responses = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'latitude=' + 39.431 + '&longitude=' + 3.0194 + '&hourly=' + params.hourly + '&timezone=' +
        params.timezone + '&start_date=' + params.start_date + '&end_date=' + params.end_date});

        const item = await responses.json();

        return new Meteo(
            item.latitude,
            item.longitude,
            item.generationtime_ms,
            item.utc_offset_seconds,
            item.timezone,
            item.timezone_abbreviation,
            item.elevation,
            item.hourly
        );


    }
}