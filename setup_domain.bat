@echo off
:: Check for administrative rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges to update Windows hosts file...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo Adding buybloom.in mapping to Windows hosts file...
findstr /i "buybloom.in" "%windir%\System32\drivers\etc\hosts" >nul
if %errorlevel% neq 0 (
    echo. >> "%windir%\System32\drivers\etc\hosts"
    echo # BuyBloom Local Domain Mapping >> "%windir%\System32\drivers\etc\hosts"
    echo 127.0.0.1 buybloom.in >> "%windir%\System32\drivers\etc\hosts"
    echo 127.0.0.1 www.buybloom.in >> "%windir%\System32\drivers\etc\hosts"
    echo 127.0.0.1 buybloom.local >> "%windir%\System32\drivers\etc\hosts"
    echo [SUCCESS] buybloom.in successfully mapped to 127.0.0.1!
) else (
    echo [INFO] buybloom.in is already present in your hosts file.
)

:: Flush DNS resolver cache
ipconfig /flushdns >nul

echo.
echo ===============================================================
echo [DONE] You can now access BuyBloom in your browser at:
echo        http://buybloom.in:3000/
echo        http://buybloom.local:3000/
echo ===============================================================
echo.
pause
