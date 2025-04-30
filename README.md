# 数学AI计算器

基于Qwen2.5-Math的智能数学计算器，能够解决从小学到大学水平的数学问题。

## 功能特点

- 人性化输入：用户可以用自然语言表达计算需求
- 详细解题步骤：展示完整的解题过程
- AI解析：提供全面的解题思路分析
- 丰富的数学符号输入界面
- 友好的用户界面设计

## 技术栈

- 前端：React + Vite
- 后端：Flask
- AI模型：Qwen2.5-Math
- 数学库：SymPy、NumPy

## 使用方法

### 环境要求

- Python 3.8+
- Node.js 16+
- npm 8+
- Qwen2.5-Math 模型

### 安装步骤

1. 确保已经下载Qwen2.5-Math模型（路径：C:\Users\ericd\AI Folder\Qwen2.5-Math-main）

2. 安装后端依赖：
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. 安装前端依赖：
   ```
   cd frontend
   npm install
   ```

### 启动应用

可以使用以下两种方式之一启动应用：

#### 方式一：使用批处理脚本（推荐）

直接双击项目根目录下的 `start.bat` 文件，它会自动启动后端和前端服务，并打开浏览器。

#### 方式二：手动启动

1. 启动后端服务：
   ```
   cd backend
   python app.py
   ```

2. 启动前端服务：
   ```
   cd frontend
   npm run dev
   ```

3. 在浏览器中访问：http://localhost:5173

### 使用说明

1. 在文本框中输入您的数学问题，例如：
   - "求解方程 x^2+3x-4=0"
   - "计算积分 ∫sin(x)dx"
   - "计算极限 lim(x→0) (sin(x)/x)"

2. 使用下方的数学符号键盘输入特殊数学符号

3. 点击"计算"按钮获取结果

4. 查看计算结果、解题步骤和AI解析 