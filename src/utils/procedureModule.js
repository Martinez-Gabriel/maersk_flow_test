
// Recibe una lista de tramites y selecciona uno aleatoriamente.
export function selectRandomProcedure(list) {
    const randomIndex = Math.floor(Math.random() * list.length);

    if(randomIndex >= 0 && randomIndex < list.length){
        const procedure = list[randomIndex];
        logsM.visibleAndClickLog(procedure.name, procedure.locator);
    }
}

