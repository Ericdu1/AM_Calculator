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
        elif "solve matrix" in query:
            return {
                'query': query,
                'latex': '\\begin{bmatrix} 2 & 1 \\\\ 1 & 3 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 8 \\end{bmatrix}',
                'explanation': '这是一个2×2线性方程组的矩阵形式。我们可以用以下方法求解：\n\n1. 使用克莱默法则\n2. 或使用高斯消元法\n3. 或使用矩阵的逆\n\n让我们用高斯消元法来解决这个问题。',
                'steps': [
                    {
                        'number': '1',
                        'title': '写出方程组',
                        'latex': '\\begin{cases} 2x + y = 5 \\\\ x + 3y = 8 \\end{cases}',
                        'explanation': '将矩阵方程转换为标准方程组形式'
                    },
                    {
                        'number': '2',
                        'title': '消元过程',
                        'latex': '\\begin{cases} 2x + y = 5 \\\\ -5y = -11 \\end{cases}',
                        'explanation': '用第一个方程的-1/2倍加到第二个方程，消去x项'
                    },
                    {
                        'number': '3',
                        'title': '求解 y',
                        'latex': 'y = \\frac{11}{5}',
                        'explanation': '从第二个方程直接解出y'
                    },
                    {
                        'number': '4',
                        'title': '求解 x',
                        'latex': 'x = \\frac{14}{5}',
                        'explanation': '将y的值代入第一个方程，解出x'
                    }
                ]
            }
        elif "sin(2x)" in query:
            return {
                'query': query,
                'latex': '\\int \\sin(2x) dx = -\\frac{1}{2}\\cos(2x) + C',
                'explanation': '这是一个三角函数积分问题。我们需要使用以下知识：\n\n1. 三角函数的基本积分公式\n2. 复合函数求导链式法则的逆用\n3. 系数提取规则',
                'steps': [
                    {
                        'number': '1',
                        'title': '识别被积函数',
                        'latex': '\\sin(2x) = \\sin(ax) \\text{ where } a=2',
                        'explanation': '这是一个复合三角函数，内部函数是2x'
                    },
                    {
                        'number': '2',
                        'title': '使用积分公式',
                        'latex': '\\int \\sin(ax) dx = -\\frac{1}{a}\\cos(ax) + C',
                        'explanation': '使用基本积分公式，注意系数a的处理'
                    },
                    {
                        'number': '3',
                        'title': '代入a=2',
                        'latex': '-\\frac{1}{2}\\cos(2x) + C',
                        'explanation': '将a=2代入得到最终结果'
                    }
                ]
            }
        elif "solve complex" in query:
            return {
                'query': query,
                'latex': 'z^2 + 2z + 2 = 0',
                'explanation': '这是一个复数方程。我们需要：\n\n1. 使用求根公式\n2. 处理复数根\n3. 验证结果',
                'steps': [
                    {
                        'number': '1',
                        'title': '使用求根公式',
                        'latex': 'z = \\frac{-2 \\pm \\sqrt{4-8}}{2} = -1 \\pm i',
                        'explanation': '使用二次方程求根公式，注意判别式为负数'
                    },
                    {
                        'number': '2',
                        'title': '分离实部和虚部',
                        'latex': 'z_1 = -1 + i, z_2 = -1 - i',
                        'explanation': '得到两个共轭复数根'
                    },
                    {
                        'number': '3',
                        'title': '验证结果',
                        'latex': '(-1 \\pm i)^2 + 2(-1 \\pm i) + 2 = 0',
                        'explanation': '代入原方程验证两个根都满足方程'
                    }
                ]
            }
        elif "differential equation" in query:
            return {
                'query': query,
                'latex': '\\frac{dy}{dx} + 2y = e^x',
                'explanation': '这是一个一阶线性微分方程。求解步骤：\n\n1. 确定方程类型\n2. 使用积分因子法\n3. 求通解和特解',
                'steps': [
                    {
                        'number': '1',
                        'title': '使用积分因子',
                        'latex': '\\mu(x) = e^{\\int 2dx} = e^{2x}',
                        'explanation': '积分因子μ(x)的计算：e的指数是系数的积分'
                    },
                    {
                        'number': '2',
                        'title': '乘以积分因子',
                        'latex': 'e^{2x}\\frac{dy}{dx} + 2e^{2x}y = e^{3x}',
                        'explanation': '方程两边同乘以积分因子'
                    },
                    {
                        'number': '3',
                        'title': '积分求解',
                        'latex': 'y = \\frac{1}{3}e^x + Ce^{-2x}',
                        'explanation': '积分后得到通解，C为任意常数'
                    }
                ]
            }
        elif "taylor series" in query:
            return {
                'query': query,
                'latex': 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + ...',
                'explanation': '这是e^x的泰勒级数展开。我们需要：\n\n1. 理解泰勒级数的概念\n2. 计算各阶导数\n3. 写出级数形式',
                'steps': [
                    {
                        'number': '1',
                        'title': '计算导数',
                        'latex': 'f^{(n)}(x) = e^x \\text{ for all } n',
                        'explanation': 'e^x的所有阶导数都等于它自己'
                    },
                    {
                        'number': '2',
                        'title': '代入x=0',
                        'latex': 'f^{(n)}(0) = 1 \\text{ for all } n',
                        'explanation': '在x=0处计算各阶导数的值'
                    },
                    {
                        'number': '3',
                        'title': '写出级数',
                        'latex': '\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}',
                        'explanation': '根据泰勒级数公式写出无穷级数形式'
                    }
                ]
            }
        elif "probability" in query:
            return {
                'query': query,
                'latex': 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
                'explanation': '这是概率论中的加法公式。我们来分析：\n\n1. 理解事件的并集和交集\n2. 避免重复计算\n3. 应用于具体问题',
                'steps': [
                    {
                        'number': '1',
                        'title': '分析事件关系',
                        'latex': 'P(A) = 0.6, P(B) = 0.4, P(A \\cap B) = 0.2',
                        'explanation': '给定两个事件的概率和它们的交集概率'
                    },
                    {
                        'number': '2',
                        'title': '应用公式',
                        'latex': 'P(A \\cup B) = 0.6 + 0.4 - 0.2 = 0.8',
                        'explanation': '使用加法公式计算并集的概率'
                    },
                    {
                        'number': '3',
                        'title': '验证结果',
                        'latex': '0 \\leq P(A \\cup B) \\leq 1',
                        'explanation': '检查结果是否满足概率的基本性质'
                    }
                ]
            }
        elif "vector calculus" in query:
            return {
                'query': query,
                'latex': '\\nabla \\times (\\nabla f) = \\vec{0}',
                'explanation': '这是向量分析中的一个重要定理：标量场的梯度的旋度恒为零。我们来证明这个定理：\n\n1. 计算梯度\n2. 计算旋度\n3. 验证结果',
                'steps': [
                    {
                        'number': '1',
                        'title': '计算梯度',
                        'latex': '\\nabla f = (\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z})',
                        'explanation': '首先写出标量场f的梯度表达式'
                    },
                    {
                        'number': '2',
                        'title': '计算旋度',
                        'latex': '\\nabla \\times (\\nabla f) = (\\frac{\\partial^2 f}{\\partial y\\partial z} - \\frac{\\partial^2 f}{\\partial z\\partial y}, \\frac{\\partial^2 f}{\\partial z\\partial x} - \\frac{\\partial^2 f}{\\partial x\\partial z}, \\frac{\\partial^2 f}{\\partial x\\partial y} - \\frac{\\partial^2 f}{\\partial y\\partial x})',
                        'explanation': '计算梯度场的旋度'
                    },
                    {
                        'number': '3',
                        'title': '使用混合偏导数定理',
                        'latex': '\\frac{\\partial^2 f}{\\partial x\\partial y} = \\frac{\\partial^2 f}{\\partial y\\partial x}',
                        'explanation': '根据施瓦茨定理，混合偏导数的顺序可以交换，所以每一项都等于零'
                    }
                ]
            }
        # 几何问题类
        elif "triangle area" in query:
            return {
                'query': query,
                'latex': 'S = \\frac{1}{2}ab\\sin(C)',
                'explanation': '这是计算三角形面积的正弦公式：\n\n1. 适用于已知两边和夹角的情况\n2. a,b为两边长度\n3. C为夹角的度数',
                'steps': [
                    {
                        'number': '1',
                        'title': '代入数据',
                        'latex': 'a = 4, b = 5, C = 60°',
                        'explanation': '假设我们有一个三角形，两边长为4和5，夹角为60度'
                    },
                    {
                        'number': '2',
                        'title': '应用公式',
                        'latex': 'S = \\frac{1}{2} \\cdot 4 \\cdot 5 \\cdot \\sin(60°)',
                        'explanation': '将数据代入面积公式'
                    },
                    {
                        'number': '3',
                        'title': '计算结果',
                        'latex': 'S = 10 \\cdot \\frac{\\sqrt{3}}{2} = 8.66',
                        'explanation': '得到三角形的面积约为8.66平方单位'
                    }
                ]
            }
        # 统计问题类
        elif "normal distribution" in query:
            return {
                'query': query,
                'latex': 'P(|X-\\mu| \\leq 2\\sigma) = 0.9545',
                'explanation': '这是正态分布的经典问题：\n\n1. 研究数据落在均值周围2个标准差范围内的概率\n2. 体现了正态分布的68-95-99.7规则\n3. 在实际应用中非常重要',
                'steps': [
                    {
                        'number': '1',
                        'title': '标准化',
                        'latex': 'Z = \\frac{X-\\mu}{\\sigma} \\sim N(0,1)',
                        'explanation': '将一般正态分布转化为标准正态分布'
                    },
                    {
                        'number': '2',
                        'title': '查表计算',
                        'latex': 'P(-2 \\leq Z \\leq 2) = 2\\Phi(2) - 1',
                        'explanation': '使用标准正态分布表计算概率'
                    },
                    {
                        'number': '3',
                        'title': '得出结论',
                        'latex': '0.9545 = 95.45\\%',
                        'explanation': '约95.45%的数据落在μ±2σ的范围内'
                    }
                ]
            }
        # 组合数学类
        elif "combination" in query:
            return {
                'query': query,
                'latex': 'C(n,r) = \\frac{n!}{r!(n-r)!}',
                'explanation': '这是组合数的计算问题：\n\n1. 从n个不同元素中选择r个的方法数\n2. 不考虑顺序\n3. 常用于概率和统计计算',
                'steps': [
                    {
                        'number': '1',
                        'title': '理解问题',
                        'latex': 'C(5,3) = \\text{从5个物品中选择3个的方法数}',
                        'explanation': '例如：从5个球中选3个，不考虑顺序'
                    },
                    {
                        'number': '2',
                        'title': '应用公式',
                        'latex': 'C(5,3) = \\frac{5!}{3!(5-3)!} = \\frac{5!}{3!2!}',
                        'explanation': '代入组合数公式'
                    },
                    {
                        'number': '3',
                        'title': '计算结果',
                        'latex': 'C(5,3) = \\frac{5 \\cdot 4}{2 \\cdot 1} = 10',
                        'explanation': '共有10种不同的选择方法'
                    }
                ]
            }
        # 数论问题类
        elif "prime factorization" in query:
            return {
                'query': query,
                'latex': '84 = 2^2 \\times 3 \\times 7',
                'explanation': '这是整数的质因数分解问题：\n\n1. 将整数表示为质数的乘积\n2. 每个质因数都要写出指数\n3. 分解过程要系统',
                'steps': [
                    {
                        'number': '1',
                        'title': '开始分解',
                        'latex': '84 = 2 \\times 42',
                        'explanation': '首先用最小的质数2去除'
                    },
                    {
                        'number': '2',
                        'title': '继续分解',
                        'latex': '42 = 2 \\times 21 \\\\21 = 3 \\times 7',
                        'explanation': '继续用质数除，直到最后都是质数'
                    },
                    {
                        'number': '3',
                        'title': '整理结果',
                        'latex': '84 = 2^2 \\times 3 \\times 7',
                        'explanation': '将所有质因数写出，相同的用指数表示'
                    }
                ]
            }
        # 线性代数扩展
        elif "eigenvalue" in query:
            return {
                'query': query,
                'latex': '\\det(A-\\lambda I) = 0',
                'explanation': '这是求矩阵特征值的问题：\n\n1. 需要解特征方程\n2. 求出特征值后可以求特征向量\n3. 对角化等问题的基础',
                'steps': [
                    {
                        'number': '1',
                        'title': '写出矩阵',
                        'latex': 'A = \\begin{bmatrix} 4 & -2 \\\\ 1 & 1 \\end{bmatrix}',
                        'explanation': '给定一个2×2矩阵A'
                    },
                    {
                        'number': '2',
                        'title': '特征方程',
                        'latex': '\\begin{vmatrix} 4-\\lambda & -2 \\\\ 1 & 1-\\lambda \\end{vmatrix} = 0',
                        'explanation': '计算行列式|A-λI|'
                    },
                    {
                        'number': '3',
                        'title': '求解方程',
                        'latex': '\\lambda^2 - 5\\lambda + 6 = 0 \\\\\\lambda = 2 \\text{ or } \\lambda = 3',
                        'explanation': '解二次方程得到两个特征值'
                    }
                ]
            }
        # 微分方程扩展
        elif "second order DE" in query:
            return {
                'query': query,
                'latex': 'y^{\'\'}+2y\'+2y=0',
                'explanation': '这是一个二阶常系数齐次线性微分方程：\n\n1. 需要求特征方程\n2. 根据特征根类型确定通解形式\n3. 写出通解',
                'steps': [
                    {
                        'number': '1',
                        'title': '特征方程',
                        'latex': 'r^2+2r+2=0',
                        'explanation': '将y=e^(rx)代入原方程得到特征方程'
                    },
                    {
                        'number': '2',
                        'title': '求解特征根',
                        'latex': 'r = -1 \\pm i',
                        'explanation': '特征方程有一对共轭复根'
                    },
                    {
                        'number': '3',
                        'title': '写出通解',
                        'latex': 'y = e^{-x}(c_1\\cos x + c_2\\sin x)',
                        'explanation': '根据复根的情况写出通解，其中c₁,c₂为任意常数'
                    }
                ]
            }
        else:
            return {
                'query': query,
                'latex': 'x^2 + 2x + 1',
                'explanation': '这是一个二次多项式。让我们分析一下这个表达式：\n\n1. 首项 x² 是二次项，表示抛物线的开口方向和宽窄\n2. 中间项 2x 是一次项，影响抛物线的对称轴位置\n3. 末项 1 是常数项，表示抛物线与y轴的交点\n\n这个多项式可以写成完全平方式：(x + 1)²',
                'steps': [
                    {
                        'number': '1',
                        'title': '分析多项式结构',
                        'latex': 'x^2',
                        'explanation': '二次项 x² 表明这是一个开口向上的抛物线，因为系数为正'
                    },
                    {
                        'number': '2',
                        'title': '配方准备',
                        'latex': 'x^2 + 2x',
                        'explanation': '观察一次项系数：2x 的系数为2，这提示我们可能可以配成完全平方式'
                    },
                    {
                        'number': '3',
                        'title': '完全平方式',
                        'latex': '(x + 1)^2',
                        'explanation': '通过配方法，我们可以发现这个多项式可以写成 (x + 1)² 的形式'
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