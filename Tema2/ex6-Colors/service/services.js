import { Colors } from "../model/models.js";
/*
export function getColors() {
    return fetch("https://theteacher.codiblau.com/public/exercicis/other/color?min=50&max=300")
        .then(response => response.json())
        .then(color => new Colors(color.background, color.color, color.width, color.height));
}

*/
export async function getColors2() {
    const res = await fetch(
        "https://theteacher.codiblau.com/public/exercicis/other/color?min=50&max=300");

    const data = await res.json();

    return new Colors(
        data.background,
        data.color,
        data.width,
        data.height
    );
}