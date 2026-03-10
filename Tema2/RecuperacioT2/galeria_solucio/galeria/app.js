// g) IIFE + h) MVC controlador
import { CanvasGallery }  from './gallery.js';
import { GaleriaService } from './service/GaleriaService.js';
import { GaleriaView }    from './view/GaleriaView.js';

(async () => {

    // ── Inicialització ──────────────────────────────────────────────────────
    const gallery = new CanvasGallery('canvas');
    const view    = new GaleriaView();

    // ── a) RADIOBUTTONS — filtres de color ──────────────────────────────────
    document.getElementById('original').addEventListener('change', () => gallery.original());
    document.getElementById('grayscale').addEventListener('change', () => gallery.grayscale());
    document.getElementById('inverted').addEventListener('change',  () => gallery.invert());
    document.getElementById('sepia').addEventListener('change',     () => gallery.sepia());

    // ── c) i d) Carregar categories i obres de l'API ────────────────────────
    let todesLesObres = [];

    try {
        // Petició 1: categories
        const categories = await GaleriaService.getCategories();
        view.renderCategories(categories);

        // Petició 2: obres d'art ordenades per data
        todesLesObres = await GaleriaService.getArtworks();
        view.renderArtworks(todesLesObres);

    } catch (err) {
        console.error('Error carregant dades:', err);
    }

    // ── b) Botó "Carregar" de cada obra ─────────────────────────────────────
    // Usem delegació d'events perquè els botons es creen dinàmicament
    document.getElementById('contain').addEventListener('click', e => {
        if (e.target.classList.contains('btn-load-img')) {
            gallery.setImage(e.target.dataset.url);
        }
    });

    // ── c) Filtre per categoria ─────────────────────────────────────────────
    document.getElementById('filters').addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            const cat = e.target.dataset.cat;
            view.filterByCategory(cat);
        }
    });

    // ── e) Formulari desar obra d'art ───────────────────────────────────────
    document.getElementById('form-send').addEventListener('click', async (e) => {
        e.preventDefault();

        const titol     = document.getElementById('form-titol').value.trim();
        const url       = document.getElementById('form-url').value.trim();
        const data      = document.getElementById('form-data').value;
        const categoria = document.getElementById('form-categoria').value;

        // Validació URL: només .jpg, .png o .jpeg
        if (!titol || !url || !data || !categoria) {
            view.mostrarMissatge('Omple tots els camps.', false);
            return;
        }
        if (!/\.(jpg|jpeg|png)$/i.test(url)) {
            view.mostrarMissatge('La URL ha de acabar en .jpg, .jpeg o .png', false);
            return;
        }

        try {
            await GaleriaService.saveArtwork(titol, url, data, categoria);
            view.mostrarMissatge('Obra desada correctament!', true);

            // Recarregar les obres per veure la nova
            todesLesObres = await GaleriaService.getArtworks();
            view.renderArtworks(todesLesObres);

        } catch (err) {
            view.mostrarMissatge('Error desant l\'obra.', false);
            console.error(err);
        }
    });

})();
