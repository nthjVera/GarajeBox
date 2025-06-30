@echo off
setlocal

REM Ir al directorio del script
cd /d "%~dp0"

REM Ir a la carpeta frontend
cd frontend

REM Comprobar Node.js
where node >nul 2>&1 || (
    echo [ERROR] Node.js no está instalado.
    pause
    exit /b
)

REM Comprobar Angular CLI
where ng >nul 2>&1 || (
    echo [ERROR] Angular CLI no está instalado.
    echo Ejecuta: npm install -g @angular/cli
    pause
    exit /b
)

REM Instalar dependencias
echo Instalando dependencias...
call npm install

REM Iniciar servidor Angular
echo Iniciando Angular...
call ng serve -o

endlocal
pause
