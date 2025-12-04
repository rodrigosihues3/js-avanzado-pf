@echo off
REM Script para importar la base de datos de San Isidro

echo ========================================
echo IMPORTANDO BASE DE DATOS SAN ISIDRO
echo ========================================
echo.

REM Configuración
set DB_NAME=sanisidro_db
set DB_USER=root
set INPUT_FILE=sanisidro_db_backup.sql

echo Base de datos: %DB_NAME%
echo Usuario: %DB_USER%
echo Archivo de entrada: %INPUT_FILE%
echo.

REM Verificar si el archivo existe
if not exist %INPUT_FILE% (
    echo ERROR: No se encuentra el archivo %INPUT_FILE%
    echo Asegurate de que el archivo este en esta carpeta.
    pause
    exit /b 1
)

echo PASO 1: Creando base de datos si no existe...
mysql -u %DB_USER% -p -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

echo.
echo PASO 2: Importando datos...
mysql -u %DB_USER% -p %DB_NAME% < %INPUT_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo IMPORTACION EXITOSA!
    echo ========================================
    echo.
    echo La base de datos %DB_NAME% ha sido restaurada.
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR EN LA IMPORTACION
    echo ========================================
    echo.
    echo Verifica que MySQL este instalado y en el PATH
    echo Verifica la contrasena de MySQL
    echo.
)

pause
