// Ex e) - Classe Clock (model)
export default class Clock {
    constructor(hours, minutes, seconds) {
        this.hours   = hours   || 0;
        this.minutes = minutes || 0;
        this.seconds = seconds || 0;
    }

    // Actualitza l'hora amb l'hora actual del sistema
    setCurrentTime() {
        const now = new Date();
        this.hours   = now.getHours();
        this.minutes = now.getMinutes();
        this.seconds = now.getSeconds();
    }

    // Actualitza l'hora a partir d'una timezone (retorna Promise)
    async setTimeFromTimezone(timezone) {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: timezone,
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);

        this.hours   = parseInt(parts.find(p => p.type === 'hour').value);
        this.minutes = parseInt(parts.find(p => p.type === 'minute').value);
        this.seconds = parseInt(parts.find(p => p.type === 'second').value);
    }
}
