import dotenv from 'dotenv';
import fs from 'fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import {logToCSV} from './utils/logsModule.js'
import {iniciarSesion} from './caller/loginModule.js'

dotenv.config();
const DOMAIN_URL = process.env.DOMAIN_URL;
const USER_CALLER_1 = process.env.USER_CALLER_1;
const PASS_CALLER_1 = process.env.PASS_CALLER_1;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logPath = resolve(__dirname, './logs/logMaerskCaller1.csv');
const maxScreenshots = 5;
const screenshotsFolder = resolve(__dirname, './logs/Caller1_screenshots');
if (!fs.existsSync(screenshotsFolder)) fs.mkdirSync(screenshotsFolder);

// // Variable de configuración de los tiempos de atención
const tiemposTurno = {
    llamar: 5000,    // Tiempo para el llamado (en milisegundos)5000
    iniciar: 5000,   // Tiempo de espera para iniciar el turno (en milisegundos)5000
    finalizar: 5000, // Tiempo para finalizar el turno (en milisegundos)5000
    intervalo: 3600000 / 4, // Intervalo entre turnos para alcanzar 4 turnos por hora (en milisegundos)3600000
};


async function takeScreenshot(page, step) {
    const timestamp = Date.now();
    const screenshotPath = path.resolve(screenshotsFolder, `Caller1_T22186_screenshot_${step}_${timestamp}.png`);
    await page.screenshot({ path: screenshotPath });
    logToCSV(logPath, 'Screenshot', `Captured screenshot: ${screenshotPath}`);
}


async function ejecutarRuta(page, ruta, ciclos) {
    for (let i = 0; i < ciclos; i++) {
        const cicloNum = i + 1;
        logToCSV(logPath, 'StartCycle', `Iniciando ciclo ${cicloNum} para turno ${ruta}`);

        try {
            if (Math.random() < 0.2 && i < maxScreenshots) {
                await takeScreenshot(page, `turno${ruta}_ciclo${cicloNum}`);
            }

            const btnLlamar = page.locator('#caller-button-llamar');
            if (await btnLlamar.isVisible()) {
                await btnLlamar.click();
                logToCSV(logPath, 'ButtonClick', 'Botón LLAMAR clickeado.');
            }

            if (ruta === 1) {
                await realizarRutaNormal(page);
            } else if (ruta === 2) {
                await realizarRutaCanceladosSinIniciar(page);
            } else if (ruta === 3) {
                await realizarRutaCanceladosIniciado(page);
            }

            logToCSV(logPath, 'EndCycle', `Ciclo ${cicloNum} finalizado para ruta ${ruta}`);

            // Intervalo entre ciclos (aproximadamente 15 minutos por ciclo para cumplir 4 por hora)
            await page.waitForTimeout(tiemposTurno.intervalo);

        } catch (error) {
            console.error(`Error en ciclo ${cicloNum} para ruta ${ruta}: ${error.message}`);
            logToCSV(logPath, 'Error', `Error en ciclo ${cicloNum} para ruta ${ruta}: ${error.message}`);
        }
    }
}

async function realizarRutaNormal(page) {
    const btnRellamar = page.locator('#caller-button-rellamar');
    for (let i = 0; i < 2; i++) {
        if (await btnRellamar.isVisible()) {
            await btnRellamar.click();
            logToCSV(logPath, 'ButtonClick', `Botón RELLAMAR clickeado (${i + 1}/2).`);
            await page.waitForTimeout(tiemposTurno.llamar);
        }
    }

    const btnIniciar = page.locator('#caller-button-atender');
    if (await btnIniciar.isVisible()) {
        await btnIniciar.click();
        logToCSV(logPath, 'ButtonClick', 'Botón INICIAR clickeado.');
    }

    await page.waitForTimeout(tiemposTurno.iniciar);

    const btnFinalizar = page.locator('#caller-button-finalizar');
    if (await btnFinalizar.isVisible()) {
        await btnFinalizar.click();
        logToCSV(logPath, 'ButtonClick', 'Botón FINALIZAR clickeado.');
    }

    await page.waitForTimeout(tiemposTurno.finalizar);
}

async function realizarRutaCanceladosSinIniciar(page) {
    const btnRellamar = page.locator('#caller-button-rellamar');
    for (let i = 0; i < 3; i++) {
        if (await btnRellamar.isVisible()) {
            await btnRellamar.click();
            logToCSV(logPath, 'ButtonClick', `Botón RELLAMAR clickeado (${i + 1}/3).`);
            await page.waitForTimeout(tiemposTurno.llamar);
        }
    }

    const btnCancelar = page.locator('#caller-button-cancelar');
    if (await btnCancelar.isVisible()) {
        await btnCancelar.click();
        logToCSV(logPath, 'ButtonClick', 'Botón CANCELAR clickeado.');
    }
}

async function realizarRutaCanceladosIniciado(page) {
    const btnRellamar = page.locator('#caller-button-rellamar');
    for (let i = 0; i < 2; i++) {
        if (await btnRellamar.isVisible()) {
            await btnRellamar.click();
            logToCSV(logPath, 'ButtonClick', `Botón RELLAMAR clickeado (${i + 1}/2).`);
            await page.waitForTimeout(tiemposTurno.llamar);
        }
    }

    const btnIniciar = page.locator('#caller-button-atender');
    if (await btnIniciar.isVisible()) {
        await btnIniciar.click();
        logToCSV(logPath, 'ButtonClick', 'Botón INICIAR clickeado.');
    }

    const btnCancelar = page.locator('#caller-button-cancelar');
    if (await btnCancelar.isVisible()) {
        await btnCancelar.click();
        logToCSV(logPath, 'ButtonClick', 'Botón CANCELAR clickeado.');
    }
}

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    await iniciarSesion(page, DOMAIN_URL, USER_CALLER_1, PASS_CALLER_1);

    await ejecutarRuta(page, 1, 110); // Ruta 1: Normal
    await ejecutarRuta(page, 2, 8); // Ruta 2: Cancelados Sin Iniciar
    await ejecutarRuta(page, 3, 2); // Ruta 3: Cancelados Iniciado

    console.log('Todos los turnos han finalizado.');
    logToCSV(logPath, 'EndTest', 'Se terminó la ejecucion del script.');

    await browser.close();
})();
