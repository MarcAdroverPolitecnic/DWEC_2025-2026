// Ex d) - Servei per obtenir l'hora d'un país
// NOTA: l'API del professor usa Intl.DateTimeFormat com a alternativa robusta
export class WorldTimeService {

    // Obté l'hora d'una timezone usant la API nativa del navegador
    // (alternativa a l'API del professor que pot estar caiguda)
    static getTimeForTimezone(timezone) {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: timezone,
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);

        return {
            hour:   parseInt(parts.find(p => p.type === 'hour').value),
            minute: parseInt(parts.find(p => p.type === 'minute').value),
            second: parseInt(parts.find(p => p.type === 'second').value),
        };
    }
}
