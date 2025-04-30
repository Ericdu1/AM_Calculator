@echo off
echo 正在安装项目依赖...

echo 安装前端依赖...
cd %~dp0frontend
call npm install

echo 安装后端依赖...
cd %~dp0backend
pip install -r requirements.txt

echo 所有依赖安装完成！
echo 现在可以运行 one_click_start.bat 来启动应用
echo.
echo 按任意键退出...
pause > nul 