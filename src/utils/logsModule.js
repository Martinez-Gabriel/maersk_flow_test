import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nameFileSave = '../logs/logMaerskTerminal.csv';

const logFilePath = resolve(__dirname, nameFileSave);

// Devuelve el Timestamp
export function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').split('.')[0];
}

// Escribe log en el archivo CSV
export function logToCSV(event, message) {
    const timestamp = getCurrentTimestamp();
    const logEntry = `${timestamp},${event},${message}\n`;

    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, 'Timestamp,Event,Message\n');
    }

    fs.appendFileSync(logFilePath, logEntry);
}

// Escribe log cuando el boton es visible
export async function logCheckVisibleButton(name, button) {
    if (button.isVisible) {
        logToCSV('ButtonCheck', `El Botón ${name} está visible.`);
    }   
}

// Escribe log cuando se realice click en el boton
export async function logClickButton(name, button) {
    await button.click();
    logToCSV('ButtonClick', `El Botón ${name} fue clickeado correctamente.`);
}

// Escribe log si el boton esta visible y ejecuta un click, si no muestra el log buttonFail
export async function visibleAndClickLog(name, button) {
    if (await button.isVisible) {
        logToCSV('ButtonCheck', `El Botón ${name} está visible.`);
        
        await button.click();
        logToCSV('ButtonClick', `El Botón ${name} fue clickeado correctamente.`);
    }else {
        logToCSV('ButtonFail', `El Botón ${name} no está visible.`);
    }
}


