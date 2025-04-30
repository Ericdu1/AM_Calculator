@echo off
echo 开始深度修复...

:: 停止可能运行的进程
echo 停止运行中的进程...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
timeout /t 2 /nobreak > nul

:: 删除node_modules
echo 删除旧的node_modules文件夹...
cd %~dp0frontend
if exist node_modules (
  rmdir /s /q node_modules
)
if exist package-lock.json (
  del /f /q package-lock.json
)

:: 清理npm缓存
echo 清理npm缓存...
call npm cache clean --force

:: 确保npm是最新版本
echo 更新npm...
call npm install -g npm

:: 重新安装依赖
echo 重新安装前端依赖包...
call npm install

:: 专门安装react-icons
echo 特别安装react-icons包...
call npm install react-icons@4.12.0 --save --force

:: 重建
echo 重建项目...
call npm rebuild

echo 深度修复完成！
echo 现在请运行one_click_start.bat来启动应用
echo.
echo 按任意键退出...
pause > nul 