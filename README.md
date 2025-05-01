# 智能数学计算器

一个基于React和TypeScript的智能数学计算器，支持多种数学表达式的计算和转换。

## 功能特点

- 🧮 智能数学计算
  - 基础运算（加减乘除、乘方、开方等）
  - 方程求解（一元二次方程、多元方程组等）
  - 微积分计算（导数、积分、极限等）
  - 几何计算（平面几何、解析几何等）

- 🔄 表达式转换
  - 支持多种数学表达式格式转换
  - 提供详细的转换步骤说明
  - 可视化的转换结果展示

- 💡 智能输入辅助
  - 实时输入建议
  - 支持键盘导航选择
  - 常用数学符号快速输入

## 技术栈

- React 18
- TypeScript
- Material-UI
- Vite
- KaTeX

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/[your-username]/math-ai-calculator.git
cd math-ai-calculator
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
math-ai-calculator/
├── src/
│   ├── components/
│   │   ├── MathInput.tsx      # 智能输入组件
│   │   ├── MathConverter.tsx  # 表达式转换组件
│   │   └── HelpDialog.tsx     # 帮助对话框组件
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
└── package.json
```

## 使用指南

点击界面右上角的帮助图标，可以查看详细的使用说明，包括：
- 基本功能介绍
- 使用技巧说明
- 支持的数学功能列表

## 贡献

欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证

MIT License 