/*
return Promise<Persona>
*/
import {Persona} from '../model/models.js';

export function getPersona(){
    return fetch("https://randomuser.me/api/")
        .then(function(resposta){
            return resposta.json();
        })
        .then(function(resposta){
            return new Persona(
                resposta.results[0].name.first,
                resposta.results[0].name.last,
                resposta.results[0].email,
                resposta.results[0].gender,
                'No DNI'
            );
        })
}