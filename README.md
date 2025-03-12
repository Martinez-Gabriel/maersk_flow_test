# SAI Maersk Flow Test

Este proyecto automatiza el flujo de trabajo de un terminal Maersk utilizando Playwright. El script navega por varias etapas de una interfaz web, interactuando con botones y registrando eventos en un archivo CSV.

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

## Estructura del Proyecto

- `src/index.js`: Script principal que automatiza el flujo de trabajo.
- `src/utils/logsModule.js`: Módulo para registrar eventos en un archivo CSV.
- `src/utils/keyboardModule.js`: Módulo para generar y manejar entradas de DNI.

