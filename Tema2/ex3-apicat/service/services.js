import {Cat as Moix} from "../model/models.js";

export function nextPage(pagina){return pagina++;}
export function previousPage(pagina){return pagina--;}

export function getCats(pagina) {
    const headers = new Headers({
        "Content-Type": "application/json",
        "x-api-key": "live_mbMOq0E2QD6A8znpWpKgeLiGQvuRgCw4nyY3BwsGjgtxGAqwALlVIRiqzpmHmhNU"
    });

    const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    return fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&limit=20&page="+pagina, requestOptions)
        .then(response => response.json())
        .then(result => {
            return result
                .map(jsonCat => clientToCat(jsonCat));
        });

    function clientToCat(result){
        return new Moix(
            result.breeds[0].name,
            result.url);
    }
}
