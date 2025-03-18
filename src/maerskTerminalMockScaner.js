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

const logPath = resolve(__dirname, './logs/logMaerskTerminal2.csv');
const dniScanList = resolve(__dirname, '../dniScanList.json');

(async () => {
    let browser;

    try {
        //headless = false => muestra el browser visualmente
        //slowMo = 500 => ralentiza la ejecución en 500ms
        browser = await chromium.launch({ headless: false, slowMo: 500 });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });

        await page.addInitScript(() => {
            window.print = () => {
                console.log('Intento de imprimir bloqueado.');
            };
        });

        const ciclos = 200;
        const delayEntreTurnos = 60000; // 1 minutos en milisegundos

        const listOfDni = keyboardM.generateDniRandoms(ciclos);
        logsM.logToCSV(logPath, 'dniInputListMock', `Lista de DNI input generada: ${listOfDni}`);

        let mockDniScanList;

        if (fs.existsSync(dniScanList)) {
            const existingList = JSON.parse(fs.readFileSync(dniScanList, 'utf8'));
            if (Array.isArray(existingList) && existingList.length === ciclos) {
                mockDniScanList = existingList;
                logsM.logToCSV(logPath, 'dniScanListMock', 'Lista de DNI escaneados existente reutilizada.');
            } else {
                mockDniScanList = await scanM.generateRandomsScanList(dniScanList, ciclos);
                logsM.logToCSV(logPath, 'dniScanListMock', `Lista de DNI escaneados generada: ${mockDniScanList}`);
            }
        } else {
            mockDniScanList = await scanM.generateRandomsScanList(dniScanList, ciclos);
            logsM.logToCSV(logPath, 'dniScanListMock', `Lista de DNI escaneados generada: ${mockDniScanList}`);
        }

        for (let i = 0; i < ciclos; i++) {

            const turnoNum = i + 1;
            console.log(`Turno ${turnoNum} de ${ciclos}`);
            logsM.logToCSV(logPath,'StartTurn', `Iniciando turno ${turnoNum} de ${ciclos}`);

            try {
                await page.goto(process.env.DOMAIN_URL + '/client/flows/dispenser_1/');
                logsM.logToCSV(logPath, 'Navigation', 'Página cargada correctamente.');

                await page.waitForTimeout(3000);

                // Stage 1 - Pantalla de bienvenida
                const botonInicio = page.locator('img.btn.btn-without-over.circle[src="/static/images/btn-inicio.png"]').first();

                if (await botonInicio.isVisible()) {
                    logsM.logToCSV(logPath, 'ButtonCheck', 'El botón con el icono Inicio está visible.');
                    await botonInicio.click();
                    logsM.logToCSV(logPath, 'ButtonClick', `El botón con el icono Inicio fue clickeado correctamente.`);
                }

                // Stage 2 - Escanear DNI

                const stageScanDNI = page.locator();  // Locator para el stage "Escanear DNI"
                if(stageScanDNI.isVisible()){
                    logsM.logToCSV(logPath, 'WaitingScanDni', 'Esperando que el usuario escanee el DNI...');

                    const userScan = await scanM.getElementJsonAtIndex(dniScanList, turnoNum); 
                    await page.keyboard.type(userScan);
                    await page.keyboard.press('Enter');
                    logsM.logToCSV(logPath, 'ScanMock', `DNI ingresado: ${userScan}`);
                    
                    // Espera hasta que el stage desaparezca
                    // await stageScanDNI.waitFor({ state: 'hidden' }); 
                }

                //Validacion stage tramites
                const stageProcedures = page.locator();
                if (stageProcedures.isVisible()) {
                    logsM.logToCSV(logPath, 'SuccessScanDni', 'DNI ESCANEADO correctamente.');    
                }

                // Stage 3 - Modulo de teclado para ingresar DNI
                const stageInputDNI = page.locator() // Locator para el stage "Input DNI"
                if (await stageInputDNI.isVisible()) {
                    logsM.logToCSV(logPath, 'FailScanDni', 'FAIL al escanear DNI.');

                    logsM.logToCSV(logPath, 'WaitingInputDni', 'Esperando que el usuario ingrese manualmente el DNI...');

                // await stageInputDNI.waitFor({ state: 'visible', timeout: 5000});
                
                    const keyboard = [
                        {
                            name: '0',
                            locator: page.locator('')
                        },
                        {
                            name: '1',
                            locator: page.locator('')
                        },
                        {
                            name: '2',
                            locator: page.locator('')
                        },
                        {
                            name: '3',
                            locator: page.locator('')
                        },
                        {
                            name: '4',
                            locator: page.locator('')
                        },
                        {
                            name: '5',
                            locator: page.locator('')
                        },
                        {
                            name: '6',
                            locator: page.locator('')
                        },
                        {
                            name: '7',
                            locator: page.locator('')
                        },
                        {
                            name: '8',
                            locator: page.locator('')
                        },
                        {
                            name: '9',
                            locator: page.locator('')
                        },
                        {
                            name: 'Borrar',
                            locator: page.locator('')
                        },
                        {
                            name: 'Ok',
                            locator: page.locator('')
                        },
                    
                    ]

                    const dniActual = await keyboardM.getElementAtIndex(listOfDni, turnoNum); 
                    await keyboardM.inputDni(page, logPath , keyboard, dniActual.toString());
                    logsM.logToCSV(logPath, 'SuccessInputDni', 'DNI INGRESADO correctamente.');    
                }
                

                // Stage 4 - Botones de tramite
                const procedureList = [
                    {
                        name: "botonMaersk",
                        locator: page.locator('img.btn.circle[src="/static/images/btn-legales.png"]').first()
                    },
                    {
                        name: "botonMaerskAereo",
                        locator: page.locator('button.btn-totem-selection2.btn-block.stage-option.strongles.pull-right', { hasText: 'JUICIOS' })
                    },
                    {
                        name: "botonMaerskLsl",
                        locator: page.locator('button.btn-totem-multioption.btn-material-bluegrey.stage-option.strongles.pull-right.btn-block', { hasText: 'OFICIAL NOTIFICADOR' })
                    },
                ]

                procedureM.selectRandomProcedure(logPath, procedureList);

                logsM.logToCSV(logPath, 'EndTurn', `Finalizado turno ${turnoNum} de ${ciclos}`);
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
