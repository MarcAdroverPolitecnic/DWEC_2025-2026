export function printCat(cat){

    const breedName = cat.breed;
    const url = cat.url;

    const app = document.querySelector("#app");

    const breed = document.createElement("p");
    breed.innerText = "breed: " + breedName;

    const img = document.createElement("img");
    img.src = url;
    img.width = 300;


    app.appendChild(breed);
    app.appendChild(img);
}