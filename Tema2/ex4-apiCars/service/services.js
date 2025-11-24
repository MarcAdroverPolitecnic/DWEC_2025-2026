import {Car} from "../model/models.js";

export function getCars(){
    return fetch("https://raw.githubusercontent.com/vega/vega/refs/heads/main/docs/data/cars.json")
        .then(response => response.json())
        .then(result =>
            result.map(car => new Car(car.Name, car.Horsepower, car.Year))
        )
}

export function findByName(cars, txt){
    if(!txt){
        return cars;
    }
    return cars.filter(car => car.name.toLowerCase().includes(txt.toLowerCase()));
}


export function findByMinHP(cars, min){
    if(!min){
        return cars;
    }
    return cars.filter(car=>car.horsepower >= min);
}

export function findByMaxHP(cars, max){
    if(!max){
        return cars;
    }
    return cars.filter(car=>car.horsepower <= max);
}

export function cerca(cars, txt, min, max){
    const carsname = findByName(cars, txt);
    const carsMinHP = findByMinHP(carsname, min);
    return findByMaxHP(carsMinHP, max);
}