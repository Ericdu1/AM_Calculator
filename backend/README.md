# Math-AI-Calculator 后端

## 功能概述

这是一个基于AI+SymPy智能兜底的数学计算器后端，具有以下特点：

1. **大模型优先，SymPy兜底**：先尝试使用Qwen2.5小模型处理数学问题，如有问题则回退到SymPy
2. **特定数学模式优化**：针对三角恒等式、平方展开、因式分解等常见数学模式进行了特别优化
3. **智能回退策略**：当AI结果无效或处理失败时，根据不同的数学类型触发SymPy兜底
4. **结果验证机制**：通过多层验证确保返回结果的正确性，避免返回未处理的表达式

## 主要组件

- **MathSolver类**：核心求解器，实现大模型调用和SymPy兜底
- **_validate_result函数**：验证大模型结果的有效性，识别未处理/错误简化的情况
- **_detect_math_pattern函数**：检测数学模式，为不同类型问题生成专门的提示词
- **sympy_fallback函数**：SymPy兜底处理，提供可靠的基础数学能力

## 使用方法

### 启动服务器

```bash
python start_server.bat  # Windows
python app.py            # Linux/Mac
```

### API端点

- **POST /api/solve**: 接收数学问题并返回解答
  - 输入: `{"query": "数学表达式或问题"}`
  - 输出: `{"latex": "结果的LaTeX表示", "steps": [...], "explanation": "...", "source": "来源"}`

## 测试工具

- **direct_test.py**: 直接使用SymPy处理表达式的测试
- **direct_validation_test.py**: 测试结果验证函数
- **pattern_test.py**: 测试数学模式检测功能

## 自动兜底情况

系统会在以下情况自动使用SymPy兜底：

1. 大模型加载失败
2. 大模型处理超时或异常
3. 大模型返回与原始表达式完全相同的结果
4. 大模型未正确解析问题（例如返回未展开的平方、未分解的因式等）

## 常见问题

- NumPy 1.x与2.x版本兼容性问题，建议使用numpy<2
- 大模型需要较多内存，如果内存不足，系统会自动退化为纯SymPy模式 