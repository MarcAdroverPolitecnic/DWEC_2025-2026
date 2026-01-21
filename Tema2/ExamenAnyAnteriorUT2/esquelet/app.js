// app.js
import GalleryService from "./service/GalleryService.js";
import GalleryView from "./view/GalleryView.js";
import CanvasView from "./view/CanvasView.js"; // Importamos la nueva clase

let allArtworks = [];     // Memoria local para guardar las obras cargadas
let canvasView;                 // Variable para guardar la instancia del Canvas


/**
 * Función principal autoejecutable (IIFE).
 * Es el punto de arranque de la aplicación.
 */
(async () => {
    try {
        console.log("Iniciando aplicación...");

        // 1. Inicializar la vista del Canvas
        canvasView = new CanvasView("canvas");

        // 2. Pedimos categorías y pintamos los filtros y el select
        const categories = await GalleryService.getCategories();
        GalleryView.renderCategories(categories, filterByCategory);
        GalleryView.fillCategorySelect(categories);

        // 3. Cargar obras
        await loadArtworks();

        // 4. Activamos el botón de "Enviar" del formulario
        initFormListener();

    } catch (error) {
        console.error("Error al iniciar la app:", error);
    }
})();

/**
 * Llama al servicio para obtener obras, las ordena por fecha y las pinta.
 */
async function loadArtworks() {
    try {
        const data = await GalleryService.getArtWorks();

        // Se asume formato YYYY-MM-DD compatible con Date
        allArtworks = data.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Renderizar pasando el callback para el canvas+
        renderCurrentGallery(allArtworks);

    } catch (error) {
        console.error("Error cargando obras:", error);
    }
}


/**
 * Filtra las obras guardadas en memoria según la categoría seleccionada.
 */
function filterByCategory(category) {
    if (category === "Totes") {
        renderCurrentGallery(allArtworks);
    } else {
        const filtered = allArtworks.filter(art => art.categoria === category);
        renderCurrentGallery(filtered);
    }
}

/**
 * Función auxiliar para pintar la galería.
 * IMPORTANTE: Aquí pasamos el "callback" que conecta la Galería con el Canvas.
 * Cuando alguien pulse el botón en la galería, se llamará a 'canvasView.setImage'.
 */
function renderCurrentGallery(works) {
    GalleryView.renderGallery(works, (url) => {
        // Esta función se ejecuta cuando el usuario hace click en "Veure al canvas"
        canvasView.setImage(url);
    });
}


/**
 * Escucha el clic en el botón "Enviar" del formulario, valida los datos,
 * crea el objeto y llama al servicio para guardarlo.
 */
function initFormListener() {
    const sendBtn = document.getElementById("form-send");
    if (!sendBtn) return;

    sendBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const titolInput = document.getElementById("form-titol");
        const urlInput = document.getElementById("form-url");
        const dataInput = document.getElementById("form-data");
        const catInput = document.getElementById("form-categoria");

        if (!titolInput.value || !urlInput.value || !dataInput.value) {
            alert("Si us plau, omple tots els camps.");
            return;
        }

        // Crear objeto para envío
        const newArt = {
            titol: titolInput.value,
            url: urlInput.value,
            data: dataInput.value,
            categoria: catInput.value
        };

        try {
            await GalleryService.saveArtWork(newArt);
            alert("Obra desada correctament");

            // Recargar para ver la nueva obra (aparecerá arriba por el sort)
            await loadArtworks();

            // Limpiar formulario
            titolInput.value = "";
            urlInput.value = "";
            dataInput.value = "";

        } catch (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        }
    });
}