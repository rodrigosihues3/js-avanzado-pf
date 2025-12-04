@echo off
REM Script para exportar la base de datos completa de San Isidro

echo ========================================
echo EXPORTANDO BASE DE DATOS SAN ISIDRO
echo ========================================
echo.

REM Configuración
set DB_NAME=sanisidro_db
set DB_USER=root
set OUTPUT_FILE=sanisidro_db_backup.sql

echo Base de datos: %DB_NAME%
echo Usuario: %DB_USER%
echo Archivo de salida: %OUTPUT_FILE%
echo.

REM Exportar base de datos completa (estructura + datos)
echo Exportando base de datos completa...
mysqldump -u %DB_USER% -p %DB_NAME% > %OUTPUT_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo EXPORTACION EXITOSA!
    echo ========================================
    echo.
    echo Archivo generado: %OUTPUT_FILE%
    echo Ubicacion: %CD%\%OUTPUT_FILE%
    echo.
    echo Puedes enviar este archivo a tu companero.
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR EN LA EXPORTACION
    echo ========================================
    echo.
    echo Verifica que MySQL este instalado y en el PATH
    echo Verifica que la base de datos exista
    echo.
)

pause
