import *as logsM from '../utils/logsModule.js';

// Recibe una lista de tramites y selecciona uno aleatoriamente.
export function selectRandomProcedure(logPath, list) {
    const randomIndex = Math.floor(Math.random() * list.length);

    if(randomIndex >= 0 && randomIndex < list.length){
        const procedure = list[randomIndex];
        logsM.visibleAndClickLog(logPath, procedure.name, procedure.locator);
    }
}

