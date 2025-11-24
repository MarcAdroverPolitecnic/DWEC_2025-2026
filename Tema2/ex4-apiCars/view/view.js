import {cerca} from "../service/services.js";

export function paint(cars){
    const app = document.querySelector("#app");

    //NOM

    const nomLabel = document.createElement("label");
    nomLabel.innerText = "NOM";
    app.appendChild(nomLabel);
    const nomInput = document.createElement("input");
    nomInput.addEventListener("input", function(){
        const cotxesFiltrats = cerca(cars, this.value, minHPInput.value, maxHPInput.value);
        paintCars(cotxesFiltrats)
    })
    app.appendChild(nomInput)

    //POTENCIA
    const minHPLabel = document.createElement("label");
    minHPLabel.innerText = "Min HP";
    app.appendChild(minHPLabel);
    const minHPInput = document.createElement("input");
    minHPInput.addEventListener("input", function(){
        const cotxesFiltrats = cerca(cars, nomInput.value , this.value, maxHPInput.value);
        paintCars(cotxesFiltrats)
    })
    app.appendChild(minHPInput)

    const maxHPLabel = document.createElement("label");
    maxHPLabel.innerText = "Max HP";
    app.appendChild(maxHPLabel);
    const maxHPInput = document.createElement("input");
    maxHPInput.addEventListener("input", function(){
        const cotxesFiltrats = cerca    (cars, nomInput.value, minHPInput.value ,this.value);
        paintCars(cotxesFiltrats)
    })
    app.appendChild(maxHPInput)

    paintCars(cars);
}

function paintCars(cars){
    const div = document.querySelector("#cars");
    div.innerHTML = "";

    for (let car of cars){
        const name = car.name;
        const horsepower = car.horsepower;
        const year = car.year;

        const nameP = document.createElement("p");
        nameP.innerText = "name: " + name;
        const horsepowerP = document.createElement("p");
        horsepowerP.innerText = "horsepower: " + horsepower;
        const yearP = document.createElement("p");
        yearP.innerText = "year: " + year;

        div.appendChild(nameP);
        div.appendChild(horsepowerP);
        div.appendChild(yearP);
    }
}