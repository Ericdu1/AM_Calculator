import re
from typing import Dict, List, Tuple

class MathKnowledge:
    """数学知识库"""
    def __init__(self):
        # 输入模板
        self.input_templates = {
            '解': [
                '解方程 {equation}',
                '解不等式 {inequality}',
                '解三角方程 {equation}',
                '解线性方程组 {equations}',
                '解微分方程 {equation}'
            ],
            '求': [
                '求导数 {function}',
                '求积分 {function}',
                '求极限 {function}',
                '求面积 {shape}',
                '求体积 {shape}',
                '求周长 {shape}',
                '求最值 {function}',
                '求解集 {set}'
            ],
            '化': [
                '化简 {expression}',
                '化为标准型 {expression}',
                '化为最简分式 {fraction}'
            ],
            '计': [
                '计算 {expression}',
                '计算概率 {probability}',
                '计算期望 {random_variable}'
            ],
            '证': [
                '证明 {theorem}',
                '证明不等式 {inequality}',
                '证明等式 {equation}'
            ],
            '转': [
                '转换为标准型 {expression}',
                '转换为一般式 {expression}',
                '转换为点斜式 {expression}',
                '转换为斜截式 {expression}',
                '转换为参数方程 {expression}',
                '转换为极坐标 {expression}',
                '转换为直角坐标 {expression}',
                '转换为二次标准型 {expression}',
                '转换为矩阵形式 {expression}',
                '转换为向量形式 {expression}',
                '转换为三角形式 {expression}',
                '转换为指数形式 {expression}',
                '转换为对数形式 {expression}',
                '转换为分式形式 {expression}',
                '转换为根式形式 {expression}'
            ]
        }

        # 关键词映射
        self.keyword_map = {
            # 基础运算
            '解方程': ['解方程', '求解', '求根', '方程解', '解'],
            '化简': ['化简', '简化', '化为最简', '化为标准型'],
            '计算': ['计算', '求值', '运算'],
            '证明': ['证明', '论证', '推导'],
            '转换': ['转换', '变换', '转化'],
            
            # 初等数学
            '分数': ['分数', '分式', '通分', '约分'],
            '因式分解': ['因式分解', '分解因式', '因式'],
            '平方根': ['平方根', '根号', '开方'],
            '指数': ['指数', '幂', '^', '**'],
            '对数': ['对数', 'log', 'ln'],
            
            # 代数
            '多项式': ['多项式', '项式', '展开'],
            '方程': ['方程', '等式'],
            '不等式': ['不等式', '大于', '小于'],
            '函数': ['函数', '映射', '对应'],
            '数列': ['数列', '等差', '等比', '数列求和'],
            
            # 几何
            '三角函数': ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'],
            '平面几何': ['三角形', '圆', '多边形', '相似', '全等'],
            '解析几何': ['直线', '圆锥曲线', '椭圆', '双曲线', '抛物线'],
            '向量': ['向量', '矢量', '点积', '叉积'],
            '坐标系': ['坐标', '极坐标', '直角坐标'],
            
            # 微积分
            '极限': ['极限', 'lim', '趋近'],
            '导数': ['导数', '微分', '求导', '导函数'],
            '积分': ['积分', '∫', '原函数', '定积分', '不定积分'],
            '微分方程': ['微分方程', '常微分方程', '偏微分方程'],
            '级数': ['级数', '数项级数', '幂级数', 'Taylor级数'],
            
            # 线性代数
            '矩阵': ['矩阵', '行列式', '矩阵运算'],
            '线性方程组': ['线性方程组', '方程组', 'Cramer法则'],
            '特征值': ['特征值', '特征向量', '对角化'],
            '二次型': ['二次型', '正定', '配方'],
            
            # 概率统计
            '概率': ['概率', '随机', '可能性'],
            '统计': ['统计', '均值', '方差', '标准差'],
            '分布': ['分布', '正态分布', '泊松分布', '二项分布'],
            '假设检验': ['假设检验', '显著性', '置信区间'],
            
            # 复变函数
            '复数': ['复数', '虚数', '模', '辐角'],
            '复变函数': ['复变函数', '解析函数', '调和函数'],
            '格式转换': ['转换为', '变换为', '化为', '转成', '变成'],
            '标准型': ['标准型', '标准式', '规范式'],
            '一般式': ['一般式', '一般型'],
            '点斜式': ['点斜式', '点斜型'],
            '斜截式': ['斜截式', '斜截型'],
            '参数方程': ['参数方程', '参数式'],
            '极坐标': ['极坐标', '极坐标式'],
            '直角坐标': ['直角坐标', '笛卡尔坐标'],
            '矩阵形式': ['矩阵形式', '矩阵表示'],
            '向量形式': ['向量形式', '向量表示']
        }

        # 公式库
        self.formulas = {
            '初等数学': {
                '二次方程': {
                    'formula': 'ax^2 + bx + c = 0',
                    'solution': 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
                    'explanation': '二次方程的一般形式和求根公式'
                },
                '韦达定理': {
                    'formula': '\\begin{cases} x_1 + x_2 = -\\frac{b}{a} \\\\ x_1x_2 = \\frac{c}{a} \\end{cases}',
                    'explanation': '二次方程根与系数的关系'
                },
                '完全平方公式': {
                    'formula': '(a\\pm b)^2 = a^2 \\pm 2ab + b^2',
                    'explanation': '平方公式'
                },
                '立方公式': {
                    'formula': 'a^3 \\pm b^3 = (a\\pm b)(a^2 \\mp ab + b^2)',
                    'explanation': '立方公式'
                }
            },
            '三角函数': {
                '和差角公式': {
                    'formula': '\\begin{cases} \\sin(A\\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B \\\\ \\cos(A\\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B \\end{cases}',
                    'explanation': '三角函数和差角公式'
                },
                '倍角公式': {
                    'formula': '\\begin{cases} \\sin 2x = 2\\sin x\\cos x \\\\ \\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x \\end{cases}',
                    'explanation': '三角函数二倍角公式'
                },
                '半角公式': {
                    'formula': '\\begin{cases} \\sin^2 \\frac{x}{2} = \\frac{1-\\cos x}{2} \\\\ \\cos^2 \\frac{x}{2} = \\frac{1+\\cos x}{2} \\end{cases}',
                    'explanation': '三角函数半角公式'
                }
            },
            '微积分': {
                '导数公式': {
                    'formula': '\\begin{cases} (x^n)\' = nx^{n-1} \\\\ (\\sin x)\' = \\cos x \\\\ (\\cos x)\' = -\\sin x \\\\ (e^x)\' = e^x \\\\ (\\ln x)\' = \\frac{1}{x} \\end{cases}',
                    'explanation': '基本导数公式'
                },
                '积分公式': {
                    'formula': '\\begin{cases} \\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\\\ \\int \\sin x dx = -\\cos x + C \\\\ \\int \\cos x dx = \\sin x + C \\\\ \\int e^x dx = e^x + C \\\\ \\int \\frac{1}{x} dx = \\ln|x| + C \\end{cases}',
                    'explanation': '基本积分公式'
                },
                '定积分性质': {
                    'formula': '\\begin{cases} \\int_a^b f(x) dx = -\\int_b^a f(x) dx \\\\ \\int_a^b [f(x)\\pm g(x)] dx = \\int_a^b f(x) dx \\pm \\int_a^b g(x) dx \\end{cases}',
                    'explanation': '定积分的基本性质'
                }
            },
            '线性代数': {
                '行列式': {
                    'formula': '|A| = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}',
                    'explanation': '三阶行列式的表示'
                },
                '矩阵乘法': {
                    'formula': 'C_{ij} = \\sum_{k=1}^n A_{ik}B_{kj}',
                    'explanation': '矩阵乘法的计算公式'
                },
                '特征值': {
                    'formula': '|A-\\lambda E| = 0',
                    'explanation': '特征值的计算方程'
                }
            },
            '概率统计': {
                '排列组合': {
                    'formula': '\\begin{cases} A_n^m = \\frac{n!}{(n-m)!} \\\\ C_n^m = \\frac{n!}{m!(n-m)!} \\end{cases}',
                    'explanation': '排列组合基本公式'
                },
                '条件概率': {
                    'formula': 'P(A|B) = \\frac{P(AB)}{P(B)}',
                    'explanation': '条件概率公式'
                },
                '全概率公式': {
                    'formula': 'P(A) = \\sum_{i=1}^n P(B_i)P(A|B_i)',
                    'explanation': '全概率公式'
                }
            },
            '格式转换': {
                '直线方程': {
                    '一般式': {
                        'formula': 'Ax + By + C = 0',
                        'explanation': '直线的一般式方程'
                    },
                    '点斜式': {
                        'formula': 'y - y_1 = k(x - x_1)',
                        'explanation': '通过点(x₁,y₁)且斜率为k的直线方程'
                    },
                    '斜截式': {
                        'formula': 'y = kx + b',
                        'explanation': '斜率为k且在y轴上的截距为b的直线方程'
                    },
                    '两点式': {
                        'formula': '\\frac{y-y_1}{y_2-y_1} = \\frac{x-x_1}{x_2-x_1}',
                        'explanation': '通过两点(x₁,y₁)和(x₂,y₂)的直线方程'
                    }
                },
                '圆锥曲线': {
                    '圆的标准方程': {
                        'formula': '(x-a)^2 + (y-b)^2 = r^2',
                        'explanation': '圆心在(a,b)，半径为r的圆的标准方程'
                    },
                    '椭圆标准方程': {
                        'formula': '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
                        'explanation': '中心在原点的椭圆标准方程'
                    },
                    '双曲线标准方程': {
                        'formula': '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
                        'explanation': '中心在原点的双曲线标准方程'
                    },
                    '抛物线标准方程': {
                        'formula': 'y^2 = 2px',
                        'explanation': '焦点在x轴上的抛物线标准方程'
                    }
                },
                '参数方程': {
                    '直线参数方程': {
                        'formula': '\\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\end{cases}',
                        'explanation': '通过点(x₀,y₀)的直线参数方程'
                    },
                    '圆的参数方程': {
                        'formula': '\\begin{cases} x = a + r\\cos t \\\\ y = b + r\\sin t \\end{cases}',
                        'explanation': '圆心在(a,b)，半径为r的圆的参数方程'
                    }
                },
                '极坐标': {
                    '直线': {
                        'formula': 'r\\cos(\\theta - \\alpha) = p',
                        'explanation': '极坐标下的直线方程'
                    },
                    '圆': {
                        'formula': 'r = 2a\\cos\\theta',
                        'explanation': '过原点的圆的极坐标方程'
                    }
                },
                '复数': {
                    '代数形式': {
                        'formula': 'z = a + bi',
                        'explanation': '复数的代数形式'
                    },
                    '三角形式': {
                        'formula': 'z = r(\\cos\\theta + i\\sin\\theta)',
                        'explanation': '复数的三角形式'
                    },
                    '指数形式': {
                        'formula': 'z = re^{i\\theta}',
                        'explanation': '复数的指数形式'
                    }
                }
            }
        }

        # 解析模板
        self.explanation_templates = {
            '解方程': {
                'template': '解方程 {equation} 的步骤如下：\n1. 将方程整理为标准形式\n2. 使用{method}方法求解\n3. 得到解：{solution}',
                'methods': {
                    '一元一次方程': '移项法',
                    '一元二次方程': '求根公式',
                    '高次方程': '因式分解或数值方法',
                    '三角方程': '三角恒等变换',
                    '指数方程': '换元法',
                    '对数方程': '换元法'
                }
            },
            '化简': {
                'template': '化简表达式 {expression} 的步骤如下：\n1. 使用{method}方法\n2. 得到简化结果：{result}',
                'methods': {
                    '多项式': '合并同类项',
                    '分式': '通分约分',
                    '根式': '有理化',
                    '三角式': '三角恒等变换',
                    '复数': '化为标准形式'
                }
            },
            '积分': {
                'template': '计算积分 ∫{integrand}dx 的步骤如下：\n1. 识别积分类型\n2. 使用{method}方法\n3. 得到积分结果：{result}',
                'methods': {
                    '多项式': '幂函数积分公式',
                    '三角函数': '三角积分公式',
                    '指数函数': '指数积分公式',
                    '有理函数': '部分分式分解',
                    '无理函数': '换元法'
                }
            },
            '证明': {
                'template': '证明{theorem}的步骤如下：\n1. 从{premise}开始\n2. 使用{method}方法\n3. 得到结论：{conclusion}',
                'methods': {
                    '代数证明': '代数变形',
                    '几何证明': '辅助线法',
                    '反证法': '反证',
                    '数学归纳': '归纳法'
                }
            },
            '转换': {
                'template': '将{expression}转换为{target_form}的步骤如下：\n1. 识别原始形式\n2. 使用{method}方法转换\n3. 得到结果：{result}',
                'methods': {
                    '直线方程': '系数变换法',
                    '圆锥曲线': '配方法',
                    '参数方程': '参数化处理',
                    '极坐标': '坐标变换',
                    '复数': '欧拉公式'
                }
            }
        }

    def get_input_suggestions(self, prefix: str) -> List[str]:
        """根据输入前缀获取输入建议"""
        suggestions = []
        for key, templates in self.input_templates.items():
            if prefix.startswith(key):
                suggestions.extend(templates)
        return suggestions

    def get_keywords(self, query: str) -> List[str]:
        """从查询中提取关键词"""
        keywords = []
        for category, words in self.keyword_map.items():
            for word in words:
                if word in query:
                    keywords.append(category)
                    break
        return keywords

    def get_relevant_formulas(self, keywords: List[str]) -> Dict:
        """获取相关的公式"""
        relevant_formulas = {}
        for keyword in keywords:
            for category, formulas in self.formulas.items():
                for name, formula in formulas.items():
                    if keyword.lower() in name.lower() or any(k.lower() in name.lower() for k in keyword.split()):
                        if category not in relevant_formulas:
                            relevant_formulas[category] = []
                        formula['name'] = name
                        relevant_formulas[category].append(formula)
        return relevant_formulas

    def generate_explanation(self, query: str, result: Dict) -> str:
        """生成计算解析"""
        keywords = self.get_keywords(query)
        if not keywords:
            return f"计算表达式 {query} 的结果为：{result['latex']}"

        explanation = []
        for keyword in keywords:
            if keyword in self.explanation_templates:
                template = self.explanation_templates[keyword]
                method = template['methods'].get(keyword, '通用方法')
                explanation.append(
                    template['template'].format(
                        equation=query,
                        expression=query,
                        integrand=query,
                        theorem=query,
                        premise="已知条件",
                        method=method,
                        solution=result['latex'],
                        result=result['latex'],
                        conclusion=result['latex']
                    )
                )

        if not explanation:
            return f"计算表达式 {query} 的结果为：{result['latex']}"

        return '\n\n'.join(explanation)

    def get_formula_suggestions(self, query: str) -> List[Dict]:
        """获取可能的公式建议"""
        keywords = self.get_keywords(query)
        relevant_formulas = self.get_relevant_formulas(keywords)
        
        suggestions = []
        for category, formulas in relevant_formulas.items():
            for formula in formulas:
                suggestions.append({
                    'category': category,
                    'name': formula.get('name', ''),
                    'formula': formula.get('formula', ''),
                    'explanation': formula.get('explanation', '')
                })
        
        return suggestions

    def get_conversion_methods(self, expression_type: str, target_form: str) -> Dict:
        """获取特定类型表达式的转换方法"""
        conversion_methods = {
            '直线方程': {
                '一般式到点斜式': '将Ax + By + C = 0变形为y = (-A/B)x - C/B，然后代入一点',
                '点斜式到一般式': '将y - y₁ = k(x - x₁)展开并整理',
                '斜截式到一般式': '将y = kx + b变形为-kx + y - b = 0'
            },
            '圆锥曲线': {
                '配方法': '将x²项和y²项分别配方，得到标准形式',
                '平移变换': '将坐标原点平移到曲线中心',
                '旋转变换': '消去xy的交叉项'
            },
            '复数': {
                '代数到三角': '计算模长r和辐角θ',
                '三角到指数': '使用欧拉公式e^(iθ) = cos θ + i sin θ',
                '指数到代数': '展开欧拉公式并分离实部虚部'
            }
        }
        return conversion_methods.get(expression_type, {}).get(target_form, '通用变换方法')

    def get_conversion_steps(self, expression: str, target_form: str) -> List[Dict]:
        """生成转换步骤"""
        steps = []
        # 根据表达式类型和目标形式生成具体步骤
        if '直线' in expression:
            steps = [
                {'step': 1, 'description': '识别原始方程形式', 'detail': '观察方程中的系数和变量'},
                {'step': 2, 'description': '整理同类项', 'detail': '将所有项移到等号一边'},
                {'step': 3, 'description': '变形', 'detail': '根据目标形式进行相应变换'},
                {'step': 4, 'description': '化简', 'detail': '整理得到最终形式'}
            ]
        elif '圆' in expression or '椭圆' in expression or '双曲线' in expression:
            steps = [
                {'step': 1, 'description': '配方准备', 'detail': '将x²项和y²项分组'},
                {'step': 2, 'description': '配方', 'detail': '对x²项和y²项分别配方'},
                {'step': 3, 'description': '标准化', 'detail': '将配方结果化为标准形式'},
                {'step': 4, 'description': '确定参数', 'detail': '确定中心、顶点、焦点等特征量'}
            ]
        elif '复数' in expression:
            steps = [
                {'step': 1, 'description': '分离实部虚部', 'detail': '将复数表示为a+bi形式'},
                {'step': 2, 'description': '计算模长', 'detail': '计算r = √(a² + b²)'},
                {'step': 3, 'description': '计算辐角', 'detail': '计算θ = arctan(b/a)'},
                {'step': 4, 'description': '写出目标形式', 'detail': '根据目标形式改写表达式'}
            ]
        return steps 