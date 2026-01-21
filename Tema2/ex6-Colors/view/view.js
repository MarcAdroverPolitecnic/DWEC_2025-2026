export function pintar(color) {

    const app = document.querySelector("#app");
    const rectangle = document.createElement("div");

    rectangle.style.width = color.amplada + "px";
    rectangle.style.height = color.alcada + "px";
    rectangle.style.backgroundColor = "#" + color.colorc;

    document.body.style.backgroundColor = "#" + color.fons;

    app.appendChild(rectangle);
}