// h) Vista — tota la interacció amb el DOM
export class GaleriaView {

    // c) Pinta els botons de categoria (substitueix Categoria 1, 2...)
    // i també omple el select del formulari
    renderCategories(categories) {
        const filters = document.getElementById('filters');
        filters.innerHTML = '';

        // Botó "Totes" sempre primer
        const liTotes = document.createElement('li');
        liTotes.innerHTML = `<a class="active" data-cat="totes">Totes</a>`;
        filters.appendChild(liTotes);

        // Un botó per cada categoria
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a data-cat="${cat}">${cat}</a>`;
            filters.appendChild(li);
        });

        // Omplir també el select del formulari
        const select = document.getElementById('form-categoria');
        select.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value       = cat;
            opt.textContent = cat;
            select.appendChild(opt);
        });
    }

    // d) Pinta les obres d'art al contenidor
    renderArtworks(artworks) {
        const contain = document.getElementById('contain');
        contain.innerHTML = '';

        artworks.forEach(obra => {
            const div = document.createElement('div');
            div.className       = 'four columns item';
            div.dataset.cat     = obra.categoria;
            div.innerHTML = `
                <div class="caption">
                    <img src="${obra.url}" alt="${obra.titol}" class="pic"/>
                    <div class="overlay">
                        <button class="btn-load-img" data-url="${obra.url}">Carregar</button>
                    </div>
                </div>
                <h4>${obra.titol}</h4>
                <p>Publicat el ${obra.data}</p>
            `;
            contain.appendChild(div);
        });
    }

    // c) Filtra les obres visibles per categoria
    filterByCategory(cat) {
        const items = document.querySelectorAll('#contain .item');
        items.forEach(item => {
            if (cat === 'totes' || item.dataset.cat === cat) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        // Ressaltar botó actiu
        document.querySelectorAll('#filters a').forEach(a => {
            a.classList.toggle('active', a.dataset.cat === cat);
        });
    }

    // Missatge de feedback al formulari
    mostrarMissatge(text, ok = true) {
        let msg = document.getElementById('form-msg');
        if (!msg) {
            msg = document.createElement('p');
            msg.id = 'form-msg';
            document.getElementById('formulari').appendChild(msg);
        }
        msg.textContent = text;
        msg.style.color = ok ? 'green' : 'red';
    }
}
