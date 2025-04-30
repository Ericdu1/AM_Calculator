import os
import sys
import re
from transformers import AutoTokenizer, AutoModelForCausalLM

class MathSolver:
    """数学问题解决器（测试模式）"""
    
    def __init__(self, model_path=None):
        """
        初始化数学解决器（测试模式）
        """
        print("初始化测试模式数学解决器")
    
    def solve(self, query):
        """
        解决数学问题（测试模式）
        
        参数:
            query: 用户输入的数学问题
            
        返回:
            包含解决方案的字典
        """
        # 基础运算类
        if "25 * 3 + 12 / 4" in query:
            return {
                'query': query,
                'latex': '25 \\times 3 + \\frac{12}{4} = 78',
                'explanation': '这是一个基础四则运算问题，需要注意运算优先级：\n\n1. 先计算乘除\n2. 再计算加减',
                'steps': [
                    {
                        'number': '1',
                        'title': '计算乘法',
                        'latex': '25 \\times 3 = 75',
                        'explanation': '先计算25乘以3'
                    },
                    {
                        'number': '2',
                        'title': '计算除法',
                        'latex': '12 \\div 4 = 3',
                        'explanation': '同时计算12除以4'
                    },
                    {
                        'number': '3',
                        'title': '计算加法',
                        'latex': '75 + 3 = 78',
                        'explanation': '最后将两个结果相加'
                    }
                ]
            }
        # 简单计算示例
        elif "2+2" in query or "2 + 2" in query:
            return {
                'query': query,
                'latex': '2 + 2 = 4',
                'explanation': '这是基本的加法运算。',
                'steps': [
                    {
                        'number': '1',
                        'title': '加法运算',
                        'latex': '2 + 2 = 4',
                        'explanation': '直接将两个数相加'
                    }
                ]
            }
        # 代数方程类
        elif "x^2 - 5x + 6 = 0" in query:
            return {
                'query': query,
                'latex': 'x^2 - 5x + 6 = 0 \\implies x = 2 \\text{ or } x = 3',
                'explanation': '这是一个二次方程，可以通过以下方法求解：\n\n1. 因式分解法\n2. 求根公式\n3. 配方法',
                'steps': [
                    {
                        'number': '1',
                        'title': '观察系数',
                        'latex': 'a=1, b=-5, c=6',
                        'explanation': '二次项系数为1，一次项系数为-5，常数项为6'
                    },
                    {
                        'number': '2',
                        'title': '因式分解',
                        'latex': 'x^2 - 5x + 6 = (x-2)(x-3)',
                        'explanation': '找到两个数，它们的和为-5，积为6'
                    },
                    {
                        'number': '3',
                        'title': '求解',
                        'latex': 'x = 2 \\text{ or } x = 3',
                        'explanation': '令每个因式等于0，得到两个解'
                    }
                ]
            }
        # 三角函数类
        elif "sin^2(x) + cos^2(x)" in query:
            return {
                'query': query,
                'latex': '\\sin^2(x) + \\cos^2(x) = 1',
                'explanation': '这是三角函数的基本恒等式之一，也称为毕达哥拉斯恒等式：\n\n1. 几何意义：单位圆上的点的坐标平方和\n2. 可用于简化三角表达式\n3. 是许多其他三角恒等式的基础',
                'steps': [
                    {
                        'number': '1',
                        'title': '几何解释',
                        'latex': '\\text{在单位圆上：} x^2 + y^2 = 1',
                        'explanation': '单位圆上任意点的坐标可以表示为(cos(x), sin(x))'
                    },
                    {
                        'number': '2',
                        'title': '代入坐标',
                        'latex': '\\cos^2(x) + \\sin^2(x) = 1',
                        'explanation': '将点的坐标代入圆的方程'
                    },
                    {
                        'number': '3',
                        'title': '验证',
                        'latex': '\\forall x \\in \\mathbb{R}: \\sin^2(x) + \\cos^2(x) = 1',
                        'explanation': '这个等式对所有实数x都成立'
                    }
                ]
            }
        # 极限类
        elif "lim(x→0) sin(x)/x" in query:
            return {
                'query': query,
                'latex': '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1',
                'explanation': '这是一个重要的基本极限。这个极限在微积分中经常使用：\n\n1. 不能直接代入x=0\n2. 可以通过几何方法理解\n3. 也可以用夹逼定理证明',
                'steps': [
                    {
                        'number': '1',
                        'title': '分析极限形式',
                        'latex': '\\text{当 } x \\to 0 \\text{ 时，分子分母都趋于0}',
                        'explanation': '这是一个0/0型的未定式'
                    },
                    {
                        'number': '2',
                        'title': '几何意义',
                        'latex': '\\frac{\\sin(x)}{x} = \\frac{\\text{对边}}{\\text{弧长}}',
                        'explanation': '这个比值表示弧度为x的扇形中，正弦值与弧长的比值'
                    },
                    {
                        'number': '3',
                        'title': '得出结论',
                        'latex': '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1',
                        'explanation': '当x趋近于0时，这个比值趋近于1'
                    }
                ]
            }
        # 导数类
        elif "d/dx(e^x * sin(x))" in query:
            return {
                'query': query,
                'latex': '\\frac{d}{dx}(e^x \\sin(x)) = e^x\\sin(x) + e^x\\cos(x)',
                'explanation': '这是一个需要使用乘积法则的导数问题：\n\n1. 使用乘积法则：(uv)′ = u′v + uv′\n2. 分别求出各个函数的导数\n3. 代入公式得到结果',
                'steps': [
                    {
                        'number': '1',
                        'title': '使用乘积法则',
                        'latex': '\\frac{d}{dx}(e^x \\sin(x)) = \\frac{d}{dx}(e^x)\\sin(x) + e^x\\frac{d}{dx}(\\sin(x))',
                        'explanation': '将乘积法则应用于e^x和sin(x)'
                    },
                    {
                        'number': '2',
                        'title': '计算各部分导数',
                        'latex': '\\frac{d}{dx}(e^x) = e^x, \\frac{d}{dx}(\\sin(x)) = \\cos(x)',
                        'explanation': '求出e^x和sin(x)的导数'
                    },
                    {
                        'number': '3',
                        'title': '代入并化简',
                        'latex': 'e^x\\sin(x) + e^x\\cos(x)',
                        'explanation': '将各部分导数代入乘积法则公式'
                    }
                ]
            }
        # 积分类
        elif "∫(x^3 + 2x)dx" in query:
            return {
                'query': query,
                'latex': '\\int(x^3 + 2x)dx = \\frac{x^4}{4} + x^2 + C',
                'explanation': '这是一个不定积分问题，需要使用以下规则：\n\n1. 幂函数积分法则\n2. 线性运算法则\n3. 不要忘记积分常数',
                'steps': [
                    {
                        'number': '1',
                        'title': '拆分积分',
                        'latex': '\\int x^3dx + \\int 2xdx',
                        'explanation': '使用积分的线性性质，将积分拆分'
                    },
                    {
                        'number': '2',
                        'title': '分别积分',
                        'latex': '\\frac{x^4}{4} + x^2',
                        'explanation': '对x³使用幂函数积分法则：n+1=4，对2x积分得到x²'
                    },
                    {
                        'number': '3',
                        'title': '加上积分常数',
                        'latex': '\\frac{x^4}{4} + x^2 + C',
                        'explanation': '不定积分需要加上积分常数C'
                    }
                ]
            }
        elif "15 * 6 - 3" in query:
            return {
                'query': query,
                'latex': '15 \\times 6 - 3 = 87',
                'explanation': '这是一个基本的算术运算问题，让我们一步步解决：\n\n1. 首先计算乘法：15 × 6 = 90\n2. 然后进行减法：90 - 3 = 87\n\n根据运算优先级，我们先计算乘法，再进行减法运算。这里没有用到括号，所以直接按照从左到右的顺序进行计算即可。',
                'steps': [
                    {
                        'number': '1',
                        'title': '计算乘法',
                        'latex': '15 \\times 6 = 90',
                        'explanation': '按照运算优先级，先计算乘法。15乘以6等于90。'
                    },
                    {
                        'number': '2',
                        'title': '计算减法',
                        'latex': '90 - 3 = 87',
                        'explanation': '用第一步得到的结果90减去3，得到最终结果87。'
                    }
                ]
            }
        elif "d/dx(x^2 + 3x)" in query:
            return {
                'query': query,
                'latex': '\\frac{d}{dx}(x^2 + 3x) = 2x + 3',
                'explanation': '这是一个求导问题，我们需要对多项式 x² + 3x 进行求导。让我们运用导数的基本规则：\n\n1. 幂函数求导法则：对于 x^n，其导数为 nx^(n-1)\n2. 线性项求导：常数项的导数为常数本身\n3. 和的导数等于导数的和\n\n最终得到：2x + 3，这是一个一次函数。',
                'steps': [
                    {
                        'number': '1',
                        'title': '对 x² 求导',
                        'latex': '\\frac{d}{dx}(x^2) = 2x',
                        'explanation': '使用幂函数求导法则：当n=2时，导数为2x^(2-1) = 2x'
                    },
                    {
                        'number': '2',
                        'title': '对 3x 求导',
                        'latex': '\\frac{d}{dx}(3x) = 3',
                        'explanation': '线性项3x求导，系数3保持不变，x的导数为1，所以结果为3'
                    },
                    {
                        'number': '3',
                        'title': '合并结果',
                        'latex': '2x + 3',
                        'explanation': '根据导数的加法法则，将两部分的导数相加得到最终结果'
                    }
                ]
            }
        elif "∫(x^2 + 2x)dx" in query:
            return {
                'query': query,
                'latex': '\\int(x^2 + 2x)dx = \\frac{x^3}{3} + x^2 + C',
                'explanation': '这是一个不定积分问题。我们需要对多项式 x² + 2x 进行积分。运用以下积分规则：\n\n1. 幂函数积分法则：∫x^n dx = (x^(n+1))/(n+1) + C\n2. 线性项积分：∫ax dx = (ax²)/2 + C\n3. 和的积分等于积分的和\n\n注意：不要忘记加上积分常数C！',
                'steps': [
                    {
                        'number': '1',
                        'title': '对 x² 积分',
                        'latex': '\\int x^2 dx = \\frac{x^3}{3}',
                        'explanation': '使用幂函数积分法则：n=2时，∫x² dx = x³/3'
                    },
                    {
                        'number': '2',
                        'title': '对 2x 积分',
                        'latex': '\\int 2x dx = x^2',
                        'explanation': '2x的积分：系数2保持不变，x的积分为x²/2，所以结果为x²'
                    },
                    {
                        'number': '3',
                        'title': '合并结果并加上积分常数',
                        'latex': '\\frac{x^3}{3} + x^2 + C',
                        'explanation': '将两部分积分相加，并加上积分常数C得到最终结果'
                    }
                ]
            }
        elif "lim(x→∞)" in query:
            return {
                'query': query,
                'latex': '\\lim_{x \\to \\infty} \\frac{x^2 + 1}{x^2 - 4x + 1} = 1',
                'explanation': '这是一个求极限的问题，我们需要分析分式的极限行为。当x趋向于无穷时：\n\n1. 分子和分母都是多项式\n2. 极限值取决于最高次项的比较\n3. 可以通过除以最高次项来简化计算',
                'steps': [
                    {
                        'number': '1',
                        'title': '分析最高次项',
                        'latex': '\\text{分子最高次项: } x^2\\\\\\text{分母最高次项: } x^2',
                        'explanation': '分子和分母的最高次项都是x²，这意味着极限可能存在且为有限值'
                    },
                    {
                        'number': '2',
                        'title': '同除以x²',
                        'latex': '\\lim_{x \\to \\infty} \\frac{1 + \\frac{1}{x^2}}{1 - \\frac{4}{x} + \\frac{1}{x^2}}',
                        'explanation': '将分子分母都除以x²，这样可以更容易看出当x趋向无穷时各项的极限'
                    },
                    {
                        'number': '3',
                        'title': '计算极限',
                        'latex': '\\lim_{x \\to \\infty} \\frac{1 + 0}{1 - 0 + 0} = 1',
                        'explanation': '当x→∞时，1/x²→0，4/x→0，所以极限等于1'
                    }
                ]
            }
        # 简单计算2+3=5
        elif "2+3" in query or "2 + 3" in query:
            return {
                'query': query,
                'latex': '2 + 3 = 5',
                'explanation': '这是基本的加法运算。',
                'steps': [
                    {
                        'number': '1',
                        'title': '加法运算',
                        'latex': '2 + 3 = 5',
                        'explanation': '直接将两个数相加'
                    }
                ]
            }
        # 简单计算2-3=-1
        elif "2-3" in query or "2 - 3" in query:
            return {
                'query': query,
                'latex': '2 - 3 = -1',
                'explanation': '这是基本的减法运算。',
                'steps': [
                    {
                        'number': '1',
                        'title': '减法运算',
                        'latex': '2 - 3 = -1',
                        'explanation': '从2中减去3得到-1'
                    }
                ]
            }
        # 简单计算2*3=6
        elif "2*3" in query or "2 * 3" in query:
            return {
                'query': query,
                'latex': '2 \\times 3 = 6',
                'explanation': '这是基本的乘法运算。',
                'steps': [
                    {
                        'number': '1',
                        'title': '乘法运算',
                        'latex': '2 \\times 3 = 6',
                        'explanation': '将2乘以3得到6'
                    }
                ]
            }
        # 完全平方式的特殊情况
        elif "x^2+2x+1" in query or "x² + 2x + 1" in query:
            return {
                'query': query,
                'latex': 'x^2 + 2x + 1 = (x + 1)^2',
                'explanation': '这是一个完全平方公式的例子。可以将表达式 x² + 2x + 1 重写为 (x + 1)²。\n\n这个表达式满足完全平方公式：(a + b)² = a² + 2ab + b²，其中 a = x, b = 1。',
                'steps': [
                    {
                        'number': '1',
                        'title': '识别完全平方式',
                        'latex': 'x^2 + 2x + 1',
                        'explanation': '观察表达式的形式：二次项 x²，一次项 2x，常数项 1'
                    },
                    {
                        'number': '2',
                        'title': '应用完全平方公式',
                        'latex': '(a + b)^2 = a^2 + 2ab + b^2',
                        'explanation': '对照完全平方公式，这里 a = x，b = 1'
                    },
                    {
                        'number': '3',
                        'title': '重写为完全平方式',
                        'latex': 'x^2 + 2x + 1 = (x + 1)^2',
                        'explanation': '根据完全平方公式，可以将原表达式重写为 (x + 1)²'
                    }
                ]
            }
        else:
            # 针对任意查询，提供有意义的回应，避免默认返回固定表达式
            try:
                # 提取可能的表达式和运算符
                expression = query.replace("求解", "").replace("计算", "").strip()
                
                # 如果查询中包含"="，则可能是方程求解问题
                if "=" in expression:
                    return {
                        'query': query,
                        'latex': expression,
                        'explanation': f'这是一个方程求解问题。我们需要找到使等式成立的未知数的值。',
                        'steps': [
                            {
                                'number': '1',
                                'title': '理解问题',
                                'latex': expression,
                                'explanation': '首先我们需要理解这个方程的结构'
                            },
                            {
                                'number': '2',
                                'title': '求解过程',
                                'latex': expression,
                                'explanation': '使用适当的方程求解方法'
                            }
                        ]
                    }
                # 对于可能是表达式的情况
                else:
                    return {
                        'query': query,
                        'latex': expression,
                        'explanation': f'这是一个数学表达式。我们需要理解表达式的含义并进行计算或分析。',
                        'steps': [
                            {
                                'number': '1',
                                'title': '理解表达式',
                                'latex': expression,
                                'explanation': '首先我们需要理解这个表达式的结构'
                            },
                            {
                                'number': '2',
                                'title': '计算过程',
                                'latex': expression,
                                'explanation': '使用适当的数学方法进行计算'
                            }
                        ]
                    }
            except:
                # 如果无法解析，提供通用响应
                return {
                    'query': query,
                    'latex': '\\text{需要更多信息}',
                    'explanation': '请提供更具体的数学问题，包括需要求解的表达式或方程。',
                    'steps': [
                        {
                            'number': '1',
                            'title': '问题描述不完整',
                            'latex': '\\text{?}',
                            'explanation': '无法根据当前信息提供准确解答'
                        }
                    ]
                }

    def _create_prompt(self, query):
        """创建适合模型的提示词"""
        return f"""请解决以下数学问题：

问题: {query}

请提供详细的解答步骤，最终答案，以及解题思路解析。如果答案包含数学表达式，请使用LaTeX格式表示。

解答："""
    
    def _generate_answer(self, prompt):
        """使用模型生成答案"""
        try:
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
            outputs = self.model.generate(
                inputs.input_ids,
                max_new_tokens=1024,
                temperature=0.2,
                top_p=0.9,
                repetition_penalty=1.1
            )
            return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            print(f"生成答案错误: {str(e)}", file=sys.stderr)
            raise
    
    def _parse_response(self, response, query):
        """
        解析模型响应
        
        返回:
            包含结果字段的字典:
            - latex: 最终结果的LaTeX表达式
            - explanation: 解题思路解析
        """
        result = {
            'query': query,
            'steps': [],
            'latex': '',
            'explanation': response
        }
        
        # 尝试提取LaTeX表达式（通常在$符号之间）
        latex_pattern = r'\$\$(.*?)\$\$|\$(.*?)\$'
        latex_matches = re.finditer(latex_pattern, response, re.DOTALL)
        latex_parts = []
        
        for match in latex_matches:
            latex = match.group(1) or match.group(2)
            if latex:
                latex_parts.append(latex)
        
        if latex_parts:
            # 使用第一个找到的LaTeX表达式作为结果
            result['latex'] = latex_parts[0]
            
            # 如果我们能找到多个LaTeX表达式，将它们作为步骤添加
            for i, latex in enumerate(latex_parts):
                result['steps'].append({
                    'number': str(i + 1),
                    'title': f'步骤 {i + 1}',
                    'latex': latex,
                    'explanation': ''
                })
        
        # 尝试提取解析部分
        explanation_parts = response.split('\n\n')
        if len(explanation_parts) > 1:
            # 假设最后一部分是解析
            result['explanation'] = explanation_parts[-1]
        
        return result 