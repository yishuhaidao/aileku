@echo off
cd /d C:\Users\Administrator\Desktop\miuse
:loop
echo Starting Python HTTP server...
python -m http.server 8000
echo Server stopped, restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto loop
