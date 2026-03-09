export class AirQualityView {

    constructor() {
        this.tbody       = document.getElementById('resultsBody');
        this.message     = document.getElementById('message');
        this.prevBtn     = document.getElementById('prevBtn');
        this.nextBtn     = document.getElementById('nextBtn');
        this.pageInfo    = document.getElementById('pageInfo');
        this.chartCanvas = document.getElementById('chartCanvas');
    }

    pintarFiles(records) {
        this.tbody.innerHTML = '';
        if (records.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="4">Sense resultats</td></tr>';
            return;
        }
        for (const r of records) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.time}</td>
                <td>${r.pm2_5 ?? '—'}</td>
                <td>${r.pm10 ?? '—'}</td>
                <td>${r.european_aqi ?? '—'}</td>
            `;
            this.tbody.appendChild(tr);
        }
    }

    actualitzarPaginacio(pagina, totalPagines) {
        this.pageInfo.textContent = `Pàgina ${pagina} de ${totalPagines || 1}`;
        this.prevBtn.style.visibility = pagina <= 1 ? 'hidden' : 'visible';
        this.nextBtn.style.visibility = (pagina >= totalPagines || totalPagines === 0) ? 'hidden' : 'visible';
    }

    mostrarMissatge(text) {
        this.message.textContent = text;
    }

    mostrarError(text = 'Hi ha hagut un error carregant les dades.') {
        this.message.textContent = text;
        this.tbody.innerHTML = `<tr><td colspan="4" style="color:red">${text}</td></tr>`;
    }

    // Ex7: Gràfic Chart.js (primera data)
    pintarGrafic(records) {
        if (!this.chartCanvas) return;
        // Si ja existia un gràfic, el destruïm
        if (this._chart) this._chart.destroy();

        const labels  = records.map(r => r.time.slice(11, 16)); // HH:MM
        const pm10    = records.map(r => r.pm10);
        const pm2_5   = records.map(r => r.pm2_5);
        const aqi     = records.map(r => r.european_aqi);

        this._chart = new Chart(this.chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'PM10',         data: pm10,  borderColor: '#e67e22', tension: 0.3, pointRadius: 2 },
                    { label: 'PM2.5',        data: pm2_5, borderColor: '#2980b9', tension: 0.3, pointRadius: 2 },
                    { label: 'European AQI', data: aqi,   borderColor: '#27ae60', tension: 0.3, pointRadius: 2 },
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
