function intervalCalculator(turnsToAttend, operators, workingHours) {
    
    const turnsPerOperator = turnsToAttend / operators;
    console.log(`Cada operador tiene que atender ${turnsPerOperator} turnos al finalizar las ${workingHours}HS.`);

    const turnsPerHourPerOperator = turnsPerOperator / workingHours;
    console.log(`Cada operador tiene que atender ${turnsPerHourPerOperator} turnos por hora.`);

    const interval = 60 / turnsPerHourPerOperator;
    console.log(`Cada operador tiene que atender un turno cada ${interval} minutos.`);

    const intervalInMilliseconds = 3600000 / turnsPerHourPerOperator;
    console.log(`Cada operador tiene que atender un turno cada ${intervalInMilliseconds} milisegundos.`);
}

// 1. cantidad de turnos por atender
// 2. cantidad de operadores
// 3. horario laboral

intervalCalculator(200, 4, 4)

