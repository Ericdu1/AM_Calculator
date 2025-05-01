import re
from sympy import sympify, simplify, Eq, solve, latex

def sympy_process(query):
    """直接用SymPy处理表达式"""
    print(f"\n===== 测试表达式: {query} =====")
    
    try:
        # 判断是否为方程求解
        if '=' in query:
            left, right = query.split('=', 1)
            print(f"解方程: 左边 = {left}, 右边 = {right}")
            eq = Eq(sympify(left), sympify(right))
            sol = solve(eq)
            print(f"方程 {eq} 的解为: {sol}")
            print(f"解的LaTeX表示: {latex(sol)}")
            return {
                'success': True,
                'latex': latex(sol),
                'explanation': f'解方程 {query} 的结果为 {sol}'
            }
        # 判断是否为化简
        elif '化简' in query:
            expr = query.replace('化简', '').strip()
            print(f"化简表达式: {expr}")
            sympified_expr = sympify(expr)
            
            # 尝试多种化简方法
            simplified = simplify(sympified_expr)
            expanded = sympified_expr.expand()
            
            print(f"原式: {sympified_expr}")
            print(f"化简结果: {simplified}")
            print(f"展开结果: {expanded}")
            
            # 选择结果与原式差异最大的作为结果
            if str(expanded) != str(sympified_expr) and len(str(expanded)) > len(str(simplified)):
                result_expr = expanded
                method = "展开"
            else:
                result_expr = simplified
                method = "化简"
                
            print(f"选择的方法: {method}")
            print(f"最终结果: {result_expr}")
            print(f"结果的LaTeX表示: {latex(result_expr)}")
            
            return {
                'success': True,
                'latex': latex(result_expr),
                'explanation': f'用{method}处理 {expr} 的结果为 {result_expr}'
            }
        # 其它情况直接计算
        else:
            print(f"计算表达式: {query}")
            expr = sympify(query)
            val = expr.evalf()
            print(f"表达式 {expr} 的计算结果为: {val}")
            print(f"计算结果的LaTeX表示: {latex(val)}")
            return {
                'success': True,
                'latex': latex(val),
                'explanation': f'计算 {query} 的结果为 {val}'
            }
    except Exception as e:
        print(f"处理失败: {str(e)}")
        return {
            'success': False,
            'error': f'处理失败: {str(e)}'
        }

# 测试表达式
test_expressions = [
    "2+2",
    "10*5",
    "x^2-4=0",
    "化简 (x+1)^2",
    "化简 a*b+a*c",
    "化简 sin(x)^2+cos(x)^2"
]

# 测试每个表达式
for expr in test_expressions:
    result = sympy_process(expr)
    print(f"处理结果: {'成功' if result['success'] else '失败'}")
    print()

print("测试完成!") 