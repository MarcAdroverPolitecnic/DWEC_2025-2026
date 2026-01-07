// view/GalleryView.js
export default class GalleryView {

    /**
     * Genera el HTML para cada obra de arte y lo inyecta en el contenedor "contain".
     * Recibe:
     * - artworks: lista de obras a pintar.
     * - onImageClick: una FUNCION que se ejecutará cuando pulsen "Veure al canvas".
     */
    static renderGallery(artworks, onImageClick) {
        const gallery = document.getElementById("contain");
        gallery.innerHTML = "";

        artworks.forEach(art => {
            const item = document.createElement("div");
            item.className = "four columns item";
            // Nota: Usamos art.categoria gracias al objeto ArtWork
            item.dataset.category = art.categoria;

            item.innerHTML = `
                <div class="caption">
                    <img src="${art.url}" class="pic">
                </div>
                <h4>${art.titol}</h4>
                <p>Publicat el ${art.data}</p>
                <button class="btn-canvas">Veure al canvas</button>
            `;

            // Asignamos el evento click sin usar window.xxx
            const btn = item.querySelector(".btn-canvas");
            btn.addEventListener("click", () => {
                onImageClick(art.url);
            });

            gallery.appendChild(item);
        });
    }

    /**
     * Pinta los enlaces de categorías en la parte superior (filtros).
     * Recibe: lista de categorías y función a ejecutar al hacer clic.
     */
    static renderCategories(categories, onFilter) {
        const filters = document.getElementById("filters");
        filters.innerHTML = "";

        const all = document.createElement("li");
        all.innerHTML = "<a href='#'>Totes</a>";
        all.onclick = (e) => { e.preventDefault(); onFilter("Totes"); };
        filters.appendChild(all);

        categories.forEach(cat => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#">${cat}</a>`;
            li.onclick = (e) => { e.preventDefault(); onFilter(cat); };
            filters.appendChild(li);
        });
    }

    /**
     * Rellena el desplegable <select> del formulario con las categorías.
     */
    static fillCategorySelect(categories) {
        const select = document.getElementById("form-categoria");
        select.innerHTML = "";

        // Opción por defecto
        const defaultOpt = document.createElement("option");
        defaultOpt.text = "Selecciona una categoria";
        select.appendChild(defaultOpt);

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }
}