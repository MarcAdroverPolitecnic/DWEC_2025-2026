// service/GalleryService.js
import ArtWork from "../model/ArtWork.js"; // Asegúrate de que la ruta sea correcta

export default class GalleryService {

    /**
     * Pide al servidor la lista de nombres de categorías (Web, Diseño, etc.)
     * Retorna: Una promesa con un array de strings.
     */
    static async getCategories() {
        const res = await fetch(
            "https://theteacher.codiblau.com/public/exercicis/galeria/categories-list"
        );
        return await res.json();
    }

    /**
     * Pide todas las obras de arte al servidor.
     * Importante: Convierte (mapea) los datos "crudos" del JSON en objetos de la clase ArtWork.
     */
    static async getArtWorks() {
        const res = await fetch(
            "https://theteacher.codiblau.com/public/exercicis/galeria/list"
        );
        const data = await res.json();
        
        return data.map(item => new ArtWork(
            item.id,
            item.titol,
            item.url,
            item.data,
            item.categoria
        ));
    }

    /**
     * Envía una nueva obra al servidor para guardarla.
     * Recibe: Un objeto con los datos de la obra.
     * Retorna: La respuesta del servidor confirmando si se guardó bien.
     */
    static async saveArtWork(artwork) {
        // Aquí artwork ya debería ser un objeto o datos listos para enviar
        const res = await fetch(
            "https://theteacher.codiblau.com/public/exercicis/galeria/save",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(artwork)
            }
        );

        const responseText = await res.text();

        try {
            const data = JSON.parse(responseText);
            if (!res.ok) {
                throw new Error(data.message || "Error desconegut del servidor");
            }
            return data;
        } catch (error) {
            if (!res.ok) {
                throw new Error(responseText);
            }
            return { message: responseText };
        }
    }
}