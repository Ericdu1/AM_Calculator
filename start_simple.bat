@echo off
echo 启动数学AI计算器...

:: 设置环境变量
set MODEL_PATH=C:/Users/ericd/AI Folder/Qwen2.5-Math-main

:: 启动后端
echo 启动后端服务...
start cmd /k "cd %~dp0backend && python app.py"

:: 等待后端启动
echo 等待后端服务启动...
timeout /t 10 /nobreak > nul

:: 启动前端
echo 启动前端服务...
cd %~dp0frontend
start cmd /k "npm run dev"

:: 等待前端启动
echo 等待前端服务启动...
timeout /t 5 /nobreak > nul

:: 打开浏览器
echo 正在打开浏览器...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo 数学AI计算器已启动！
echo 如果浏览器没有自动打开，请手动访问: http://localhost:5173
echo 按任意键退出此窗口...
pause > nul 