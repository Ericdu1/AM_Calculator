import requests
import json

# 测试URL
API_URL = "http://127.0.0.1:5000/api/solve"

# 测试表达式
test_expressions = [
    "2+2",
    "10*5",
    "x^2-4=0",
    "化简 (x+1)^2"
]

# 测试每个表达式
for expr in test_expressions:
    print(f"\n===== 测试表达式: {expr} =====")
    
    # 发送POST请求
    try:
        response = requests.post(
            API_URL,
            json={"query": expr},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        # 检查响应状态码
        if response.status_code == 200:
            result = response.json()
            print(f"状态: 成功")
            print(f"来源: {result.get('source', '未知')}")
            print(f"LaTeX: {result.get('latex', '无')}")
            print(f"步骤数: {len(result.get('steps', []))}")
            
            # 显示步骤
            for i, step in enumerate(result.get('steps', [])):
                print(f"  步骤 {i+1}: {step.get('title')} - {step.get('latex')}")
                
            # 显示解析
            if result.get('explanation'):
                explanation = result.get('explanation')
                if len(explanation) > 200:
                    explanation = explanation[:200] + "..."
                print(f"解析: {explanation}")
        else:
            print(f"状态: 失败 (HTTP {response.status_code})")
            print(f"错误: {response.text}")
            
    except Exception as e:
        print(f"状态: 错误")
        print(f"异常: {str(e)}")

print("\n测试完成!") 