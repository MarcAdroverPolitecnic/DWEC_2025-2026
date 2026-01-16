export default class Meteo {
    constructor(latitude, longitude, generationtime_ms, utc_offset_seconds, timezone, timezone_abbreviation,
                elevation, hourly_units, time, pm10, pm2_5, european_aqi, hourly, time2, pm102, pm2_52, european_aqi2) {

        this.latitude = latitude;
        this.longitude = longitude;
        this.generationtime_ms = generationtime_ms;
        this.utc_offset_seconds = utc_offset_seconds;
        this.timezone = timezone;
        this.timezone_abbreviation = timezone_abbreviation;
        this.elevation = elevation;
        this.hourly_units = hourly_units;
        //this.time = time;
        //this.hourly = hourly;

    }
}