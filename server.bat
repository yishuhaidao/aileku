@echo off
cd /d C:\Users\Administrator\Desktop\miuse
:loop
python -m http.server 8099
timeout /t 2 >nul
goto loop
