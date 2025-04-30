# 数学AI计算器

一个能够解决小学到大学级别数学问题的AI计算器，使用Qwen2.5-Math模型作为AI后端。

## 功能特点

- 自然语言输入：直接输入数学问题描述
- 步骤显示：详细展示解题步骤
- AI解析：使用强大的Qwen2.5-Math模型处理复杂数学问题
- 友好的用户界面：类似Symbolab的直观界面

## 技术栈

- 前端：React + Vite
- 后端：Flask
- AI模型：Qwen2.5-Math

## 启动项目

### 简易启动方式（推荐）

直接双击`start_simple.bat`文件启动项目。

### 手动启动

1. 启动后端：
   ```
   cd backend
   python app.py
   ```

2. 启动前端：
   ```
   cd frontend
   npm run dev
   ```

3. 在浏览器中访问：http://localhost:5173

## 注意事项

- 确保已安装Python和Node.js
- 后端依赖项：`pip install -r backend/requirements.txt`
- 前端依赖项：`cd frontend && npm install`
- 确保Qwen2.5-Math模型已正确配置

## 使用说明

1. 在文本框中输入您的数学问题，例如：
   - "求解方程 x^2+3x-4=0"
   - "计算积分 ∫sin(x)dx"
   - "计算极限 lim(x→0) (sin(x)/x)"

2. 使用下方的数学符号键盘输入特殊数学符号

3. 点击"计算"按钮获取结果

4. 查看计算结果、解题步骤和AI解析 