@echo off
echo 正在修复依赖问题...

:: 停止可能运行的进程
taskkill /f /im node.exe >nul 2>&1

:: 安装react-icons
echo 安装缺少的react-icons依赖...
cd %~dp0frontend
call npm install react-icons --save

:: 清理缓存
echo 清理npm缓存...
call npm cache clean --force

:: 重新构建
echo 重新构建项目...
call npm run build

echo 修复完成！请尝试使用one_click_start.bat重新启动应用。
echo.
echo 按任意键退出...
pause > nul 