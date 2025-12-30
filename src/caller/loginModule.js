import { logToCSV } from '../utils/logsModule.js';

export async function iniciarSesion(page, logPath, url, username, password) {
    const inputUsuario = page.locator('input[name="username"]');
    const inputContrasena = page.locator('input[type="password"][name="password"][placeholder="Contraseña"]');
    const botonLogin = page.locator('button[type="submit"]');

    try {
        console.log("Iniciando sesión...");
        logToCSV(logPath, 'StartSession', 'Iniciando sesión');

        await page.goto( url + '/login/');
        console.log('Esperando a que la página cargue...');
        logToCSV(logPath, 'Navigation', 'Página cargada correctamente.');

        if (await inputUsuario.isVisible()) {
            await inputUsuario.focus();
            await inputUsuario.fill(username);
            await page.keyboard.press('Tab');
            logToCSV(logPath, 'InputAction', 'Usuario ingresado correctamente.');
        } else {
            console.error('Campo de usuario no visible.');
        }

        if (await inputContrasena.isVisible()) {
            console.log('Password recibido:', password);
            await inputContrasena.fill(password);
            logToCSV(logPath, 'InputAction', 'Contraseña ingresada correctamente.');
        } else {
            console.error('Campo de contraseña no visible.');
        }

        if (await botonLogin.isVisible()) {
            await botonLogin.click();
            logToCSV(logPath, 'ButtonClick', 'Botón de inicio de sesión clickeado.');

            await page.goto( url + '/caller/');

        } else {
            console.error('Botón de inicio de sesión no visible.');
        }

        console.log('Inicio de sesión exitoso.');

    } catch (error) {
        console.error(`Error al iniciar sesión: ${error.message}`);
        logToCSV(logPath, 'Error', `Error al iniciar sesión: ${error.message}`);
    }
}