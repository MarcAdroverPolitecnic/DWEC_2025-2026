// Ex g) - Mòdul principal (controlador)
// Ex f) - IIFE que s'executa quan carrega el DOM
import { ClockRenderer }   from './assets/js/ClockRenderer.js';
import { ClockView }       from './view/ClockView.js';
import { WorldTimeService } from './service/WorldTimeService.js';
import Clock               from './model/Clock.js';

// Ex f) IIFE
(async () => {

    // ── Inicialització ──────────────────────────────────────────────────────
    // Ex h) MVC: creem model, vista i renderer per separat
    const clock    = new Clock(8, 35, 55);
    const view     = new ClockView();
    const renderer = new ClockRenderer('canvas');

    let playInterval = null; // Ex c) referència al setInterval

    // Funció central: actualitza inputs, refresca rellotge
    function drawClock() {
        view.updateInputs(clock.hours, clock.minutes, clock.seconds);
        renderer.draw();
    }

    // Dibuix inicial
    drawClock();

    // ── Ex a) SLIDERS ───────────────────────────────────────────────────────
    const sliderH = document.getElementById('sliderHours');
    const sliderM = document.getElementById('sliderMinutes');
    const sliderS = document.getElementById('sliderSeconds');

    // Sincronitzem sliders amb l'hora inicial
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
    // Array de timezones definit a l'HTML (l'accedim com a global)
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

    // Pintar totes al carregar
    renderZones('Totes');

    // Botons filtre
    const filterMap = {
        'Totes': 'Totes', 'Europa': 'Europe', 'Pacífic': 'Pacific',
        'Asia': 'Asia',   'America': 'America', 'Altres': 'Altres'
    };

    document.querySelectorAll('#filtres button').forEach(btn => {
        btn.addEventListener('click', () => {
            renderZones(filterMap[btn.textContent]);
        });
    });

    // ── Ex c) PLAY / STOP ───────────────────────────────────────────────────
    document.getElementById('play').addEventListener('click', () => {
        if (playInterval) return; // ja està en marxa
        // Posar l'hora actual
        clock.setCurrentTime();
        view.syncSliders(clock.hours, clock.minutes, clock.seconds);
        drawClock();
        // Actualitzar cada segon
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
    // Botons de països predefinits de l'HTML
    document.querySelectorAll('#paisos button').forEach(btn => {
        // Mapeig nom del botó → timezone
        const tzMap = {
            'Moscú':    'Europe/Moscow',
            'Lima':     'America/Lima',
            'Asunción': 'America/Asuncion',
            'Tokio':    'Asia/Tokyo',
            'Sydney':   'Australia/Sydney'
        };

        btn.addEventListener('click', () => {
            const tz = tzMap[btn.textContent];
            if (!tz) return;

            // Ex d) 3 "cridades" simulades amb Intl (equivalents a les 3 peticions POST)
            // En un context real serien 3 fetch() amb Promise.all
            const time = WorldTimeService.getTimeForTimezone(tz);

            // Simular que esperam les 3 cridades amb Promise.all
            Promise.all([
                Promise.resolve(time.hour),
                Promise.resolve(time.minute),
                Promise.resolve(time.second)
            ]).then(([h, m, s]) => {
                clock.hours   = h;
                clock.minutes = m;
                clock.seconds = s;
                view.syncSliders(h, m, s);
                drawClock(); // Cridem drawClock() quan han acabat les 3 cridades
                view.setActiveCountry(btn);
            });
        });
    });

})();
