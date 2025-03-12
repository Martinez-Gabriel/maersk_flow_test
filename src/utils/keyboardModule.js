import *as logsM from './logsModule.js'

// Genera una lista de DNI aleatorios reciendo la cantidad de elementos a generar
export function generateDniRandoms(cant) {
    const dniList = [];
    for (let i = 0; i < cant; i++) {
        dniList.push(Math.floor(Math.random() * (99999999 - 1000000 + 1)) + 1000000);
    }
    logsM.logToCSV('DniList', `Lista de DNI generada: ${dniList}`);
    return dniList;
}

// Recorre dni ingresado y ejecuta click en cada boton mostrando log
export async function inputDni(page, keyboard, dni){
    for (const digit of dni){
        const boton = keyboard.find(b => b.nombre === digit);
    
        if(boton){
        const buttonElement = page.locator(boton.locator)
        logsM.visibleAndClickLog(digit, buttonElement)
        }   
    }
    const botonOk = keyboard.find(b => b.nombre === 'Ok');
    if (botonOk) {
        logsM.visibleAndClickLog('Ok', botonOk.locator)
    }
}

// Devuelve el elemento de la lista en la posición indicada
export async function getElementAtIndex(list, index) {
    if (index >= 0 && index < list.length) {
        return list[index];
    } else {
        throw new Error('Índice fuera de rango');
    }
}
