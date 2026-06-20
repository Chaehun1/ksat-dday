@echo off
chcp 65001 >nul
set "PATH=%PATH%;%LOCALAPPDATA%\Microsoft\WinGet\Links"
py "%USERPROFILE%\ksat-dday\archive\compress_audio.py"
echo.
pause
