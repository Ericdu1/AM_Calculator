import sys
import re
from api.math_solver import MathSolver

"""
直接测试_validate_result函数，不依赖于其他测试逻辑
"""

def test_direct_validation():
    print("===== 直接测试验证函数 =====")
    
    # 创建solver实例
    solver = MathSolver()
    
    # 测试用例
    test_cases = [
        {
            "name": "三角恒等式-已简化",
            "query": "sin(x)^2 + cos(x)^2",
            "result": {"latex": "1", "steps": [{"number": "1", "latex": "sin(x)^2 + cos(x)^2"}]},
            "expected": True
        },
        {
            "name": "三角恒等式-未简化",
            "query": "sin(x)^2 + cos(x)^2",
            "result": {"latex": "sin(x)^2 + cos(x)^2", "steps": [{"number": "1", "latex": "sin(x)^2 + cos(x)^2"}]},
            "expected": False
        },
        {
            "name": "平方展开-已展开",
            "query": "(x+1)^2",
            "result": {"latex": "x^2 + 2x + 1", "steps": [{"number": "1", "latex": "(x+1)^2"}]},
            "expected": True
        },
        {
            "name": "平方展开-未展开",
            "query": "(x+1)^2",
            "result": {"latex": "(x+1)^2", "steps": [{"number": "1", "latex": "(x+1)^2"}]},
            "expected": False
        },
        {
            "name": "因式分解-已分解",
            "query": "a*b + a*c",
            "result": {"latex": "a(b+c)", "steps": [{"number": "1", "latex": "a*b + a*c"}]},
            "expected": True
        },
        {
            "name": "因式分解-未分解",
            "query": "a*b + a*c",
            "result": {"latex": "ab + ac", "steps": [{"number": "1", "latex": "a*b + a*c"}]},
            "expected": False
        }
    ]
    
    # 测试所有用例
    for case in test_cases:
        print(f"\n测试: {case['name']}")
        print(f"查询: {case['query']}")
        print(f"结果LaTeX: {case['result']['latex']}")
        print(f"期望验证结果: {case['expected']}")
        
        # 直接调用验证函数
        is_valid = solver._validate_result(case['result'], case['query'])
        print(f"实际验证结果: {is_valid}")
        
        # 再添加一个特殊处理，看看是否能直接通过字符串匹配检测到未分解形式
        if "ab + ac" in case['result']['latex'] or "ab+ac" in case['result']['latex'].replace(" ", ""):
            print(">> 直接字符串匹配到未分解形式 ab+ac，应该返回False!")
            
        match = is_valid == case['expected']
        print(f"测试结果: {'✓ 正确' if match else '✗ 错误'}")
        
        if not match:
            print("===> 断点调试: ")
            # 对未分解形式做特殊处理
            result_latex = case['result']['latex']
            result_normalized = result_latex.replace(" ", "")
            print(f"  原始LaTeX: '{result_latex}'")
            print(f"  标准化LaTeX: '{result_normalized}'")
            print(f"  直接检查 'ab + ac' in result_latex: {('ab + ac' in result_latex)}")
            print(f"  直接检查 'ab+ac' in result_normalized: {('ab+ac' in result_normalized)}")
            
            # 使用正则表达式检查
            pattern = r'ab\+ac'
            match = re.search(pattern, result_normalized)
            print(f"  正则表达式检查 '{pattern}': {match is not None}")
            if match:
                print(f"    匹配内容: '{match.group(0)}'")

if __name__ == "__main__":
    test_direct_validation() 