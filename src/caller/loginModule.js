import dotenv from 'dotenv';
import {logToCSV} from './utils/logsModule.js'

dotenv.config();

export async function iniciarSesion(page, url, username, password) {
    const inputUsuario = page.locator('input[name="username"]');
    const inputContrasena = page.locator('input[name="password"]');
    const botonLogin = page.locator('button[type="submit"]');

    try {
        console.log("Iniciando sesión...");
        logToCSV('StartSession', 'Iniciando sesión');

        await page.goto(url + '/caller/');
        logToCSV('Navigation', 'Página cargada correctamente.');

        if (await inputUsuario.isVisible()) {
            await inputUsuario.focus();
            await inputUsuario.fill(username);
            await page.keyboard.press('Tab');
            logToCSV('InputAction', 'Usuario ingresado correctamente.');
        } else {
            console.error('Campo de usuario no visible.');
        }

        if (await inputContrasena.isVisible()) {
            await inputContrasena.fill(password);
            logToCSV('InputAction', 'Contraseña ingresada correctamente.');
        } else {
            console.error('Campo de contraseña no visible.');
        }

        if (await botonLogin.isVisible()) {
            await botonLogin.click();
            logToCSV('ButtonClick', 'Botón de inicio de sesión clickeado.');
        } else {
            console.error('Botón de inicio de sesión no visible.');
        }

        console.log('Inicio de sesión exitoso.');

    } catch (error) {
        console.error(`Error al iniciar sesión: ${error.message}`);
        logToCSV('Error', `Error al iniciar sesión: ${error.message}`);
    }
}