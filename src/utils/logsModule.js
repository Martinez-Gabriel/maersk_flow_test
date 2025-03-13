import fs from 'fs';
import moment from 'moment-timezone';


// Devuelve el Timestamp
export function getCurrentTimestamp() {
    const now = moment().tz('America/Argentina/Buenos_Aires');
    return now.format('YYYY-MM-DD HH:mm:ss');
}

// Escribe log en el archivo CSV
export function logToCSV(logPath ,event, message) {
    const timestamp = getCurrentTimestamp();
    const logEntry = `${timestamp},${event},${message}\n`;

    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, 'Timestamp,Event,Message\n');
    }

    fs.appendFileSync(logPath, logEntry);
}

// Escribe log si el boton esta visible y ejecuta un click, si no muestra el log buttonFail
export async function visibleAndClickLog(logPath, name, button) {
    if (await button.isVisible) {
        logToCSV(logPath, 'ButtonCheck', `El Botón ${name} está visible.`);
        
        await button.click();
        logToCSV(logPath, 'ButtonClick', `El Botón ${name} fue clickeado correctamente.`);
    }else {
        logToCSV(logPath, 'ButtonFail', `El Botón ${name} no está visible.`);
    }
}

// Escribe log cuando el boton es visible
// export async function logCheckVisibleButton(logPath, name, button) {
//     if (button.isVisible) {
//         logToCSV(logPath,'ButtonCheck', `El Botón ${name} está visible.`);
//     }   
// }

// Escribe log cuando se realice click en el boton
// export async function logClickButton(logPath, name, button) {
//     await button.click();
//     logToCSV(logPath, 'ButtonClick', `El Botón ${name} fue clickeado correctamente.`);
// }