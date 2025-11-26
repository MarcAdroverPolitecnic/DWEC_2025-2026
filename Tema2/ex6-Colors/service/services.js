import { Colors } from "../model/models.js";

export function getColors() {
    return fetch("https://theteacher.codiblau.com/public/exercicis/other/color?min=50&max=300")
        .then(response => response.json())
        .then(color => new Colors(color.background, color.color, color.width, color.height));
}
