// Ex h) - Vista: tota la interacció amb el DOM
export class ClockView {

    // Actualitza els inputs hidden que llegeix clock.js
    updateInputs(hours, minutes, seconds) {
        document.getElementById('hours').value   = hours;
        document.getElementById('minutes').value = minutes;
        document.getElementById('seconds').value = seconds;
    }

    // Sincronitza els sliders amb els valors actuals
    syncSliders(hours, minutes, seconds) {
        document.getElementById('sliderHours').value   = hours;
        document.getElementById('sliderMinutes').value = minutes;
        document.getElementById('sliderSeconds').value = seconds;
    }

    // Pinta la llista de timezones filtrada
    renderTimezones(list) {
        const ul = document.getElementById('timezoneList');
        ul.innerHTML = '';
        list.forEach(tz => {
            const li = document.createElement('li');
            li.textContent = tz;
            ul.appendChild(li);
        });
    }

    // Pinta botons de països (Ex d)
    renderCountryButtons(countries) {
        const container = document.getElementById('paisos');
        container.innerHTML = '';
        Object.entries(countries).forEach(([code, name]) => {
            const btn = document.createElement('button');
            btn.textContent = name;
            btn.dataset.code = code;
            container.appendChild(btn);
        });
    }

    // Mostra el país actiu (ressaltat)
    setActiveCountry(btn) {
        document.querySelectorAll('#paisos button').forEach(b => b.classList.remove('actiu'));
        if (btn) btn.classList.add('actiu');
    }
}
