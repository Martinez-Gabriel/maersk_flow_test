import dotenv from 'dotenv';
import { chromium } from 'playwright';
import *as logsM from './utils/logsModule.js'
import *as keyboardM from './terminal/keyboardModule.js'
import *as procedureM from './terminal/procedureModule.js'
import *as scanM from './terminal/scanModule.js';

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logPath = resolve(__dirname, './logs/logMaerskTerminal.csv');
const dniScanList = resolve(__dirname, '../dniScanListWithFails.json');

(async () => {
    let browser;

    try {
        //headless = false => muestra el browser visualmente
        //slowMo = 500 => ralentiza la ejecución en 500ms
        browser = await chromium.launch({ headless: false, slowMo: 500 });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1366, height: 768});

        await page.addInitScript(() => {
            window.print = () => {
                console.log('Intento de imprimir bloqueado.');
            };
        });

        const ciclos = 5;
        const delayEntreTurnos = 60000; // 1 minutos en milisegundos

        const listOfDni = keyboardM.generateDniRandoms(ciclos + 1);
        logsM.logToCSV(logPath, 'DniInputListMock', `Lista de DNI input generada: ${listOfDni}`);

        let mockDniScanList;
        
        if (fs.existsSync(dniScanList)) {
            const existingList = JSON.parse(fs.readFileSync(dniScanList, 'utf8'));
            if (Array.isArray(existingList) && existingList.length === ciclos) {
                mockDniScanList = existingList;
                logsM.logToCSV(logPath, 'DniScanListMock', 'Lista de DNI escaneados existente reutilizada.');
            } else {
                mockDniScanList = await scanM.generateRandomsScanListWithFails(dniScanList, ciclos);
                logsM.logToCSV(logPath, 'DniScanListMock', `Lista de DNI escaneados generada: ${mockDniScanList}`);
            }
        } else {
            mockDniScanList = await scanM.generateRandomsScanListWithFails(dniScanList, ciclos);
            logsM.logToCSV(logPath, 'DniScanListMock', `Lista de DNI escaneados generada: ${mockDniScanList}`);
        }

        for (let i = 0; i < ciclos; i++) {

            const turnoNum = i + 1;
            console.log(`Turno ${turnoNum} de ${ciclos}`);
            logsM.logToCSV(logPath,'StartTurn', `>>>>>>>>>> Iniciando turno ${turnoNum} de ${ciclos} <<<<<<<<<<`);

            try {
                // '/client/flows/dispenser_1/'
                await page.goto(process.env.DOMAIN_URL + '/client/flows/maersk/');
                logsM.logToCSV(logPath, 'Navigation', 'Página cargada correctamente.');

                await page.waitForTimeout(3000);

                // Stage 1 - Pantalla de bienvenida
                const stageWelcome = page.locator('#stage-container div').first();

                if (await stageWelcome.isVisible()) {
                    logsM.logToCSV(logPath, 'StageWelcome', 'El stage Bienvenido está visible.');
                    await stageWelcome.click();
                }

                // Stage 2 - Escanear DNI
                const stageScanDNI = page.locator('#boton_next1').nth(1);
                if(stageScanDNI.isVisible()){
                    logsM.logToCSV(logPath, 'WaitingScanDni', '🕑 Esperando que el usuario escanee el DNI...');

                    const userScan = await scanM.getElementJsonAtIndex(dniScanList, turnoNum); 
                    await page.keyboard.type(userScan);
                    await page.keyboard.press('Enter');
                    logsM.logToCSV(logPath, 'ScanDniMock', `DNI escaneado ${userScan}.`);
                }

                //Validacion stage tramites
                const stageProcedures = page.locator('div:nth-child(4)').first();
                if (stageProcedures.isVisible()) {
                    logsM.logToCSV(logPath, 'SuccessScanDni', '✅ DNI escaneado correctamente.');    
                }

                // Stage 3 - Modulo de teclado para ingresar DNI
                const stageInputDNI = page.locator('#stage-container div').filter({ hasText: 'El DNI ingresado es incorrecto DNI' }).first()
                if (await stageInputDNI.isVisible()) {
                    logsM.logToCSV(logPath, 'FailScanDni', '⛔ FALLO los datos obtenidos no son validos.');
                    logsM.logToCSV(logPath, 'WaitingInputDni', '🕑 Esperando que el usuario ingrese manualmente el DNI...');
                
                    const keyboard = [
                        {
                            name: '0',
                            locator: page.locator('#stage-container #cero')
                        },
                        {
                            name: '1',
                            locator: page.locator('.key-character').first()
                        },
                        {
                            name: '2',
                            locator: page.locator('div:nth-child(2) > .key-character').first()
                        },
                        {
                            name: '3',
                            locator: page.locator('div:nth-child(3) > .key-character').first()
                        },
                        {
                            name: '4',
                            locator: page.locator('div:nth-child(4) > div > .key-character').first()
                        },
                        {
                            name: '5',
                            locator: page.locator('div:nth-child(4) > div:nth-child(2) > .key-character').first()
                        },
                        {
                            name: '6',
                            locator: page.locator('div:nth-child(4) > div:nth-child(3) > .key-character').first()
                        },
                        {
                            name: '7',
                            locator: page.locator('div:nth-child(5) > div > .key-character').first()
                        },
                        {
                            name: '8',
                            locator: page.locator('div:nth-child(5) > div:nth-child(2) > .key-character').first()
                        },
                        {
                            name: '9',
                            locator: page.locator('div:nth-child(5) > div:nth-child(3) > .key-character').first()
                        },
                        {
                            name: 'Borrar',
                            locator: page.locator('div:nth-child(6) > div > .key-character').first()
                        },
                        {
                            name: 'Ok',
                            locator: page.locator('#stage-container #buttonOkDni')
                        },
                    
                    ]

                    const dniActual = await keyboardM.getElementAtIndex(listOfDni, turnoNum);
                    logsM.logToCSV(logPath, 'InputDniMock', `DNI ${dniActual} a ingresar.`);

                    await keyboardM.inputDni(page, logPath , keyboard, dniActual.toString());

                    await page.waitForTimeout(3000);
                    logsM.logToCSV(logPath, 'SuccessInputDni', '✅ DNI ingresado correctamente.');    
                }
                

                // Stage 4 - Botones de tramite
                const procedureList = [
                    {
                        name: "botonMaersk",
                        locator: page.getByText('Maersk', { exact: true })
                    },
                    {
                        name: "botonMaerskAereo",
                        locator: page.getByText('maersk-aereo')
                    },
                    {
                        name: "botonMaerskLsl",
                        locator: page.getByText('maersk-lsl')
                    },
                ]
                procedureM.selectRandomProcedure(logPath, procedureList);
                
                await page.waitForTimeout(3000);

                // Stage 5 - Confirmación de encolamiento
                const stageQueue = page.locator('asd') // Locator para el stage "Encolamiento"
                if (await stageQueue.isVisible()) {
                    logsM.logToCSV(logPath, 'EndTurn', `✅ Finalizado correctamente turno ${turnoNum} de ${ciclos}`);
                }
                logsM.logToCSV(logPath, 'Error', `❌ Error al encolar el turno ${turnoNum} de ${ciclos}>`);

            } catch (error) {
                logsM.logToCSV(logPath, 'Error', `Error en el turno ${turnoNum}: ${error.message}`);
                console.error(`Error en el turno ${turnoNum}:`, error);
            }

            if (turnoNum < ciclos) {
                console.log(`Esperando 1 minutos antes de emitir el siguiente turno...`);
                await page.waitForTimeout(delayEntreTurnos);
            }
        }
    } catch (error) {
        logsM.logToCSV(logPath, 'CriticalError', `Error crítico: ${error.message}`);
        console.error('Error crítico:', error);
    } finally {
        if (browser) {
            await browser.close();
            logsM.logToCSV(logPath, 'Browser', 'Navegador cerrado correctamente.');
        }
    }
})();

// Manejo de interrupciones manuales (Ctrl + C)
process.on('SIGINT', async () => {
    console.log('Interrupción detectada. Cerrando el navegador...');
    if (browser) {
        await browser.close();
        logsM.logToCSV(logPath, 'Interruption', 'Navegador cerrado debido a interrupción manual.');
    }
    process.exit();
});
