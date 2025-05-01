from api.math_solver import MathSolver

def test_trigonometric_identities():
    print("===== 测试三角恒等式处理 =====")
    
    # 创建求解器
    solver = MathSolver()
    
    # 测试用例
    test_cases = [
        "sin(x)^2 + cos(x)^2",
        "sin(x)^2 + cos(x)^2 - 1",
        "tan(x) - sin(x)/cos(x)",
        "sin(2x) - 2*sin(x)*cos(x)"
    ]
    
    # 测试每个三角恒等式
    for expr in test_cases:
        print(f"\n表达式: {expr}")
        print("====================")
        
        # 检测模式和生成提示词
        pattern = solver._detect_math_pattern(expr)
        prompt = solver._create_prompt(expr)
        print(f"检测到的模式: {pattern}")
        print(f"生成的提示词前几行:\n{prompt.split('要求：')[0]}...")
        
        # 直接使用SymPy处理
        result = solver.sympy_fallback(expr)
        print(f"SymPy结果: {result['latex']}")
        
        # 假设AI处理结果，测试验证函数
        # 1. 正确结果
        correct_result = {"latex": "1", "steps": [{"number": "1", "latex": expr}]}
        if "sin(x)^2 + cos(x)^2" == expr:
            is_valid = solver._validate_result(correct_result, expr)
            print(f"验证正确结果 '1': {is_valid}")
        
        # 2. 错误结果（未简化）
        incorrect_result = {"latex": expr, "steps": [{"number": "1", "latex": expr}]}
        is_valid = solver._validate_result(incorrect_result, expr)
        print(f"验证未简化结果 '{expr}': {is_valid}")

if __name__ == "__main__":
    test_trigonometric_identities() 