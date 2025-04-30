@echo off
echo 启动数学AI计算器...

:: 设置环境变量
set MODEL_PATH=C:/Users/ericd/AI Folder/Qwen2.5-Math-main

:: 杀死可能占用端口的进程
echo 正在清理可能占用端口的进程...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
timeout /t 2 /nobreak > nul

:: 启动后端
echo 启动后端服务...
start cmd /k "cd %~dp0backend && python app.py"

:: 等待后端启动
echo 等待后端服务启动...
timeout /t 15 /nobreak > nul

:: 检查后端是否正常运行
echo 检查后端服务状态...
curl http://localhost:5000/api/health
if %errorlevel% neq 0 (
  echo 警告: 后端服务可能未正常启动，但将继续尝试启动前端...
  timeout /t 5 /nobreak > nul
)

:: 启动前端
echo 启动前端服务...
start cmd /k "cd %~dp0frontend && npm run dev"

:: 等待前端启动
echo 等待前端服务启动...
timeout /t 15 /nobreak > nul

:: 打开浏览器
echo 正在打开浏览器...
timeout /t 3 /nobreak > nul
start http://127.0.0.1:5173

echo 数学AI计算器已启动！
echo 如果浏览器没有自动打开或显示连接拒绝，请尝试手动访问:
echo - 前端: http://127.0.0.1:5173
echo - 后端: http://127.0.0.1:5000/api/health
echo.
echo 提示: 如果仍然无法连接，请尝试手动运行以下命令:
echo 1. 在一个命令窗口中: cd %~dp0backend ^& python app.py
echo 2. 在另一个命令窗口中: cd %~dp0frontend ^& npm run dev
echo.
echo 按任意键退出此窗口...
pause > nul 