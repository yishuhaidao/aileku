@echo off
cd /d C:\Users\Administrator\Desktop\miuse
:loop
echo Starting Python server at %date% %time%
python -m http.server 8000
echo Server died at %date% %time%, restarting...
timeout /t 2 >nul
goto loop
