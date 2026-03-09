import { ClockRenderer }    from './assets/js/ClockRenderer.js';
import { ClockView }        from './view/ClockView.js';
import { WorldTimeService } from './service/WorldTimeService.js';
import Clock                from './model/Clock.js';

// Ex f) IIFE
(async () => {

    // ── Inicialització ──────────────────────────────────────────────────────
    const clock    = new Clock(8, 35, 55);
    const view     = new ClockView();
    const renderer = new ClockRenderer('canvas');
    let playInterval = null;

    function drawClock() {
        view.updateInputs(clock.hours, clock.minutes, clock.seconds);
        renderer.draw();
    }

    drawClock();

    // ── Ex a) SLIDERS ───────────────────────────────────────────────────────
    const sliderH = document.getElementById('sliderHours');
    const sliderM = document.getElementById('sliderMinutes');
    const sliderS = document.getElementById('sliderSeconds');

    view.syncSliders(clock.hours, clock.minutes, clock.seconds);

    sliderH.addEventListener('input', () => {
        clock.hours = parseInt(sliderH.value);
        document.getElementById('labelHours').textContent = sliderH.value;
        drawClock();
    });
    sliderM.addEventListener('input', () => {
        clock.minutes = parseInt(sliderM.value);
        document.getElementById('labelMinutes').textContent = sliderM.value;
        drawClock();
    });
    sliderS.addEventListener('input', () => {
        clock.seconds = parseInt(sliderS.value);
        document.getElementById('labelSeconds').textContent = sliderS.value;
        drawClock();
    });

    // ── Ex b) ZONES HORÀRIES ────────────────────────────────────────────────
    function renderZones(filter) {
        let filtered;
        if (filter === 'Totes') {
            filtered = timeZones;
        } else if (filter === 'Altres') {
            const prefixes = ['Europe/', 'Pacific/', 'Asia/', 'America/'];
            filtered = timeZones.filter(tz => !prefixes.some(p => tz.startsWith(p)));
        } else {
            filtered = timeZones.filter(tz => tz.startsWith(filter + '/'));
        }
        view.renderTimezones(filtered);
    }

    renderZones('Totes');

    const filterMap = {
        'Totes': 'Totes', 'Europa': 'Europe', 'Pacífic': 'Pacific',
        'Asia': 'Asia', 'America': 'America', 'Altres': 'Altres'
    };

    document.querySelectorAll('#filtres button').forEach(btn => {
        btn.addEventListener('click', () => renderZones(filterMap[btn.textContent]));
    });

    // ── Ex c) PLAY / STOP ───────────────────────────────────────────────────
    document.getElementById('play').addEventListener('click', () => {
        if (playInterval) return;
        clock.setCurrentTime();
        view.syncSliders(clock.hours, clock.minutes, clock.seconds);
        drawClock();
        playInterval = setInterval(() => {
            clock.setCurrentTime();
            view.syncSliders(clock.hours, clock.minutes, clock.seconds);
            drawClock();
        }, 1000);
    });

    document.getElementById('stop').addEventListener('click', () => {
        clearInterval(playInterval);
        playInterval = null;
    });

    // ── Ex d) HORES ARREU DEL MÓN ──────────────────────────────────────────
    // Petició 1: carregar els països des de l'API i crear els botons
    try {
        const paisos = await WorldTimeService.getPaisos();
        // paisos = { "MOS": "Moscú", "LIM": "Lima", ... }

        const container = document.getElementById('paisos');
        container.innerHTML = '';

        Object.entries(paisos).forEach(([codi, nom]) => {
            const btn = document.createElement('button');
            btn.textContent  = nom;
            btn.dataset.codi = codi; // guardem el codi al dataset del botó

            // Petició 2: quan es fa click, fer les 3 cridades paral·leles
            btn.addEventListener('click', async () => {
                try {
                    view.setActiveCountry(btn);

                    // Promise.all fa HOUR, MINUTE i SECOND en paral·lel
                    // drawClock() només es crida quan les 3 han acabat
                    const { hour, minute, second } = await WorldTimeService.getFullTime(codi);

                    clock.hours   = hour;
                    clock.minutes = minute;
                    clock.seconds = second;
                    view.syncSliders(hour, minute, second);
                    drawClock();

                } catch (err) {
                    console.error('Error carregant hora del país:', err);
                }
            });

            container.appendChild(btn);
        });

    } catch (err) {
        console.error('Error carregant països:', err);
        // Si l'API falla, deixem els botons originals de l'HTML
    }

})();
