@echo off
:loop
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ConnectTimeout=15 -R 80:localhost:8099 localhost.run 2>C:\Users\Administrator\Desktop\miuse\lhr_url.txt
timeout /t 5 >nul
goto loop
