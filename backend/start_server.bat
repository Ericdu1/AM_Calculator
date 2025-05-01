@echo off
echo 启动Math-AI计算器后端服务器...
echo.

REM 检查是否已安装必要的库
pip show accelerate >nul 2>&1
if %errorlevel% neq 0 (
  echo 安装accelerate库...
  pip install accelerate
)

pip show sympy >nul 2>&1
if %errorlevel% neq 0 (
  echo 安装sympy库...
  pip install sympy
)

pip show transformers >nul 2>&1
if %errorlevel% neq 0 (
  echo 安装transformers库...
  pip install transformers
)

pip show torch >nul 2>&1
if %errorlevel% neq 0 (
  echo 安装torch库...
  pip install torch
)

pip show flask-cors >nul 2>&1
if %errorlevel% neq 0 (
  echo 安装flask-cors库...
  pip install flask-cors
)

echo.
echo 所有依赖已满足，正在启动服务器...
echo.
echo 服务器将在http://127.0.0.1:5000上运行
echo 按Ctrl+C终止服务器
echo.

REM 使用flask命令启动服务器
python -m flask --app app run --host=127.0.0.1 --port=5000 