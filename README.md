# SAI Maersk Flow Test

Este proyecto automatiza el flujo de trabajo de un terminal Maersk utilizando Playwright. El script navega por varias etapas de una interfaz web, interactuando con botones y registrando eventos en un archivo CSV.

## Mockeos para Escaneo de DNI

El proyecto incluye la capacidad de generar datos simulados para el escaneo de DNI. Esto se realiza mediante el módulo `scanModule.js`, que genera strings que simulan los datos de un DNI escaneado.


### Generación de DNI Simulados

La función `generateScanDni(typeDni)` genera un DNI aleatorio con datos de un usuario aleatorio obtenido de la API `randomuser.me`. Dependiendo del tipo de DNI (`typeDni`), se genera un string con o sin número de CUIT.

## Requisitos

- Node.js (versión 18 o superior)
- npm (gestor de paquetes de Node.js)

## Instalación

1. Clona el repositorio:

    ```sh
    git clone <URL_DEL_REPOSITORIO>
    cd maersk-flow-test
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

## Uso

Para ejecutar el script principal, usa el siguiente comando:

```sh
npm run terminal
```

El script abrirá un navegador, navegará por la interfaz web y registrará eventos en un archivo CSV ubicado en `logs/logMaerskTerminal.csv`.

## Comandos Disponibles

- `npm run terminal`: Ejecuta el script principal.
- `npm run terminal2`: Ejecuta el script `maerskTerminalMockScaner.js`.
- `npm run caller1`: Ejecuta el script `maerskCaller1.js`.
- `npm run caller2`: Ejecuta el script `maerskCaller2.js`.
- `npm run caller3`: Ejecuta el script `maerskCaller3.js`.
- `npm run caller4`: Ejecuta el script `maerskCaller4.js`.

## Estructura del Proyecto

- `src/maerskTerminal.js`: Script principal que automatiza el flujo de trabajo.
- `src/maerskTerminalMockScaner.js`: Script que simula el escaneo de DNI.
- `src/maerskCaller1.js`: Script para manejar llamadas en el sistema Maersk (Caller 1).
- `src/maerskCaller2.js`: Script para manejar llamadas en el sistema Maersk (Caller 2).
- `src/maerskCaller3.js`: Script para manejar llamadas en el sistema Maersk (Caller 3).
- `src/maerskCaller4.js`: Script para manejar llamadas en el sistema Maersk (Caller 4).
- `src/utils/logsModule.js`: Módulo para registrar eventos en un archivo CSV.
- `src/terminal/keyboardModule.js`: Módulo para generar y manejar entradas de DNI.
- `src/terminal/procedureModule.js`: Módulo para seleccionar procedimientos aleatorios.
- `src/terminal/scanModule.js`: Módulo para generar y manejar escaneos de DNI.
- `src/caller/loginModule.js`: Módulo para manejar el inicio de sesión.





