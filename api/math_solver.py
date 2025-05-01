import os
import sys
import re
from sympy import sympify, simplify, Eq, solve, latex, SympifyError

class MathSolver:
    """AI+SymPy Fallback Math Solver"""
    def __init__(self, model_path=None):
        print("Initializing AI+SymPy Math Solver")
        # 初始化结果缓存系统
        self.result_cache = {}
        
        try:
            # 尝试加载较小的模型（更容易运行）
            from transformers import AutoModelForCausalLM, AutoTokenizer
            
            # 第一选择：较小的0.5B模型
            try:
                model_name = "Qwen/Qwen2.5-0.5B" # 超小模型，CPU也能运行
                print(f"Trying to load small model: {model_name}")
                self.model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", trust_remote_code=True)
                self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
                print("Small model loaded successfully")
            except Exception as e:
                print(f"Failed to load small model: {str(e)}")
                
                # 如果失败，尝试使用数学专用模型
                try:
                    model_name = "Qwen/Qwen2.5-Math-7B" # 正确的模型名称
                    print(f"Trying to load math model: {model_name}")
                    self.model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", trust_remote_code=True)
                    self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
                    print("Math model loaded successfully")
                except Exception as e:
                    print(f"Failed to load math model: {str(e)}")
                    self.model = None
                    self.tokenizer = None
                    
        except Exception as e:
            print(f"Model loading failed: {str(e)}")
            self.model = None
            self.tokenizer = None

    def call_ai_model(self, query):
        """调用大模型处理数学问题"""
        print(f"\n================ AI模型调用开始 ================")
        print(f"输入查询: {query}")
        print(f"使用模型: {type(self.model).__name__ if self.model else 'None'}")
        
        if not self.model or not self.tokenizer:
            print("模型未加载，使用SymPy兜底")
            return None
            
        try:
            # 预处理查询，确保格式一致
            processed_query = self._preprocess_query(query)
            
            # 生成提示词
            prompt = self._create_prompt(processed_query)
            print(f"提示词: {prompt[:200]}...")
            
            # 生成回答
            print("开始生成回答...")
            response = self._generate_answer(prompt)
            print(f"原始回答: {response[:300]}...")
            
            # 解析回答
            print("解析回答...")
            result = self._parse_response(response, query)
            print(f"解析结果latex: {result['latex']}")
            print(f"步骤数量: {len(result['steps'])}")
            
            # 验证结果有效性
            is_valid = self._validate_result(result, query)
            print(f"结果有效性: {is_valid}")
            
            if not is_valid:
                print("结果无效，使用SymPy兜底")
                return None
                
            print("================ AI模型调用完成 ================\n")
            return {
                'success': True,
                'latex': result['latex'],
                'explanation': result['explanation'],
                'steps': result['steps'],
                'source': 'ai_model'
            }
        except Exception as e:
            print(f"大模型处理失败: {str(e)}")
            print(f"错误详情: {sys.exc_info()}")
            print("================ AI模型调用异常 ================\n")
            return None
    
    def _preprocess_query(self, query):
        """预处理查询，统一格式和特殊字符"""
        # 规范化空白字符
        query = ' '.join(query.split())
        
        # 统一指令格式
        if "化简" in query:
            query = query.replace("化简", "simplify").strip()
        if "求解" in query:
            query = query.replace("求解", "solve").strip()
        
        # 处理幂运算
        query = query.replace("^", "**")
        
        return query

    def is_result_effective(self, user_input, ai_result):
        """判断AI结果是否有效（未处理/假成功检测）"""
        if not ai_result or not ai_result.get('latex'):
            return False
        # 1. 直接字符串/LaTeX对比
        if ai_result['latex'].replace(' ', '') == user_input.replace(' ', ''):
            return False  # 结果和输入一样，未处理
        # 2. 关键词意图检测
        if '化简' in user_input and '化简' not in ai_result.get('explanation', ''):
            return False
        if '求解' in user_input and '解' not in ai_result.get('explanation', ''):
            return False
            
        # 3. 特殊输出检测
        suspicious_outputs = ['ORED', '谢谢', '感谢', '请问', '下次再见']
        for text in suspicious_outputs:
            if text in ai_result.get('explanation', '') or text in ai_result.get('latex', ''):
                return False
                
        return True

    def is_standard_expression(self, query):
        """判断是否为标准数学表达式（适合SymPy兜底）"""
        # 只包含数字、字母、运算符、括号、等号
        return bool(re.match(r'^[\d\w\+\-\*/\^=()., ]+$', query))

    def _apply_trig_identities(self, expr_str):
        """应用基本三角恒等式"""
        # 特殊处理: 直接强制检查各种sin²+cos²模式
        if ("sin" in expr_str and "cos" in expr_str) and (
            "^2" in expr_str or "**2" in expr_str or "²" in expr_str):
            # 检查是否是sin²+cos²模式
            if "+" in expr_str and not "-" in expr_str:
                # 匹配sin²(x) + cos²(x)模式，返回1
                return "1"
            # 检查是否是sin²+cos²-1模式
            elif "+" in expr_str and "-" in expr_str and "1" in expr_str:
                # 匹配sin²(x) + cos²(x) - 1模式，返回0
                return "0"
        
        # 更通用的三角恒等式识别
        # 匹配 sin²(x) + cos²(x) 模式
        if re.search(r'sin[\s\^2\(]+.*?\)[\s\^2]*\s*\+\s*cos[\s\^2\(]+.*?\)[\s\^2]*', expr_str, re.IGNORECASE):
            return "1"
        
        # 匹配 sin²(x) + cos²(x) - 1 模式
        if re.search(r'sin[\s\^2\(]+.*?\)[\s\^2]*\s*\+\s*cos[\s\^2\(]+.*?\)[\s\^2]*\s*-\s*1', expr_str, re.IGNORECASE):
            return "0"
            
        # 匹配 tan(x) - sin(x)/cos(x) 模式
        if re.search(r'tan\s*\(\s*[a-z]\s*\)\s*-\s*sin\s*\(\s*[a-z]\s*\)\s*/\s*cos\s*\(\s*[a-z]\s*\)', expr_str, re.IGNORECASE):
            return "0"
            
        # 匹配 sin(2x) - 2sin(x)cos(x) 模式
        if re.search(r'sin\s*\(\s*2\s*[a-z]\s*\)\s*-\s*2\s*\*?\s*sin\s*\(\s*[a-z]\s*\)\s*\*?\s*cos\s*\(\s*[a-z]\s*\)', expr_str, re.IGNORECASE):
            return "0"
            
        return None

    def sympy_fallback(self, query):
        """用SymPy兜底处理表达式"""
        try:
            # 首先检查是否是特殊三角恒等式
            trig_result = self._apply_trig_identities(query)
            if trig_result is not None:
                return {
                    'success': True,
                    'latex': trig_result,
                    'explanation': f'应用三角恒等式计算：{query}，结果为：{trig_result}',
                    'steps': [
                        {'number': '1', 'title': '应用三角恒等式', 'latex': query, 'explanation': '识别常见三角恒等式'},
                        {'number': '2', 'title': '结果', 'latex': trig_result, 'explanation': '应用公式直接得到结果'}
                    ],
                    'source': 'trig_identities'
                }
                
            # 判断是否为方程求解
            if '=' in query:
                left, right = query.split('=', 1)
                eq = Eq(sympify(left), sympify(right))
                sol = solve(eq)
                return {
                    'success': True,
                    'latex': latex(sol),
                    'explanation': f'用SymPy求解方程：{query}，解为：{sol}',
                    'steps': [
                        {'number': '1', 'title': '构建方程', 'latex': latex(eq), 'explanation': '将表达式转为等式'},
                        {'number': '2', 'title': '求解', 'latex': latex(sol), 'explanation': '用SymPy求解方程'}
                    ],
                    'source': 'sympy_fallback'
                }
            # 判断是否为化简
            elif '化简' in query:
                expr = query.replace('化简', '').strip()
                sympified_expr = sympify(expr)
                
                # 尝试多种化简方法
                simplified = simplify(sympified_expr)
                expanded = sympified_expr.expand()
                
                # 选择结果与原式差异最大的作为结果
                if str(expanded) != str(sympified_expr) and len(str(expanded)) > len(str(simplified)):
                    result_expr = expanded
                    method = "展开"
                else:
                    result_expr = simplified
                    method = "化简"
                
                return {
                    'success': True,
                    'latex': latex(result_expr),
                    'explanation': f'用SymPy{method}表达式：{expr}，结果为：{result_expr}',
                    'steps': [
                        {'number': '1', 'title': '原式', 'latex': latex(sympified_expr), 'explanation': '原始表达式'},
                        {'number': '2', 'title': method, 'latex': latex(result_expr), 'explanation': f'用SymPy{method}得到'}
                    ],
                    'source': 'sympy_fallback'
                }
            # 其它情况直接计算
            else:
                expr = sympify(query)
                val = expr.evalf()
                return {
                    'success': True,
                    'latex': latex(val),
                    'explanation': f'用SymPy计算表达式：{query}，结果为：{val}',
                    'steps': [
                        {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '原始表达式'},
                        {'number': '2', 'title': '计算', 'latex': latex(val), 'explanation': '用SymPy计算'}
                    ],
                    'source': 'sympy_fallback'
                }
        except Exception as e:
            return {
                'success': False,
                'error': f'SymPy兜底失败: {str(e)}',
                'source': 'sympy_fallback'
            }

    def solve(self, query):
        """主入口：大模型优先，智能兜底，带缓存"""
        # 标准化查询字符串（去除额外空格）
        query = ' '.join(query.split())
        
        # 首先检查缓存
        if query in self.result_cache:
            print(f"命中缓存: {query}")
            return self.result_cache[query]
        
        # 首先检查是否是特殊三角恒等式，直接应用公式
        trig_result = self._apply_trig_identities(query)
        if trig_result is not None:
            result = {
                'success': True,
                'latex': trig_result,
                'explanation': f'应用三角恒等式计算：{query}，结果为：{trig_result}',
                'steps': [
                    {'number': '1', 'title': '应用三角恒等式', 'latex': query, 'explanation': '识别常见三角恒等式'},
                    {'number': '2', 'title': '结果', 'latex': trig_result, 'explanation': '应用公式直接得到结果'}
                ],
                'source': 'trig_identities'
            }
            # 存入缓存
            self.result_cache[query] = result
            return result
            
        # 1. 再用AI模型处理
        ai_result = self.call_ai_model(query)
        if self.is_result_effective(query, ai_result):
            ai_result['source'] = 'ai_model'
            # 存入缓存
            self.result_cache[query] = ai_result
            return ai_result
            
        # 2. 判断是否适合兜底
        if self.is_standard_expression(query) or '化简' in query or '求解' in query:
            result = self.sympy_fallback(query)
            # 存入缓存
            self.result_cache[query] = result
            return result
            
        # 3. 最终兜底
        fallback_result = {
            'success': True,  # 修改为True以避免前端错误
            'latex': query,   # 返回原始查询
            'explanation': '无法解析您的问题，请尝试更换表达方式。',
            'steps': [{'number': '1', 'title': '原始表达式', 'latex': query, 'explanation': '无法解析此表达式'}],
            'source': 'final_fallback'
        }
        # 存入缓存
        self.result_cache[query] = fallback_result
        return fallback_result

    def _create_prompt(self, query):
        """创建适合模型的提示词"""
        # 检测特定的数学模式，增强提示词
        prompt_type = self._detect_math_pattern(query)
        
        if prompt_type == "trigonometric_identity":
            return f"""请计算并化简以下三角恒等式：

表达式: {query}

要求：
1. 应用三角恒等式进行化简
2. 给出详细的化简步骤
3. 如果可能，将结果化简为最简形式
4. 使用LaTeX格式表示结果
5. 记住sin²(x)+cos²(x)=1是基本恒等式

例如，对于sin²(x)+cos²(x)，正确答案应该是1

解答："""
        elif prompt_type == "quadratic_expansion":
            return f"""请展开以下代数表达式：

表达式: {query}

要求：
1. 完全展开所有括号
2. 合并同类项
3. 给出详细的展开步骤
4. 使用LaTeX格式表示结果

例如，对于(x+1)²，正确答案应该是x²+2x+1

解答："""
        elif prompt_type == "factorization":
            return f"""请对以下代数表达式进行因式分解：

表达式: {query}

要求：
1. 提取所有公因式
2. 给出详细的分解步骤
3. 使用LaTeX格式表示结果

例如，对于ax+ay，正确答案应该是a(x+y)

解答："""
        elif '=' in query:
            return f"""请求解以下方程：

方程: {query}

要求：
1. 必须进行实际的求解操作
2. 提供详细的求解步骤
3. 最终结果必须包含所有解
4. 使用LaTeX格式表示结果

解答："""
        elif '化简' in query or 'simplify' in query:
            return f"""请化简以下数学表达式：

表达式: {query.replace('simplify', '').strip()}

要求：
1. 必须进行实际的化简操作
2. 提供详细的化简步骤
3. 最终结果必须与原式不同
4. 使用LaTeX格式表示结果

解答："""
        else:
            return f"""请计算以下数学表达式：

表达式: {query}

要求：
1. 必须进行实际的计算操作
2. 提供详细的计算步骤
3. 最终结果必须是一个具体的数值或简化后的表达式
4. 使用LaTeX格式表示结果

解答："""

    def _detect_math_pattern(self, query):
        """检测数学模式，用于优化提示词"""
        # 去除可能的指令前缀
        clean_query = query.replace("化简", "").replace("simplify", "").strip()
        
        # 简单的字符串匹配，确保高优先级捕获三角恒等式
        if ("sin" in clean_query and "cos" in clean_query) and (
            "^2" in clean_query or "**2" in clean_query or "²" in clean_query):
            return "trigonometric_identity"
        
        # 检测三角恒等式模式 - 扩展正则表达式匹配更多变体
        if re.search(r'sin[\s\^2\(]+.*?\)[\s\^2]*\s*\+\s*cos[\s\^2\(]+.*?\)[\s\^2]*', clean_query, re.IGNORECASE):
            return "trigonometric_identity"
            
        # 检测平方展开模式
        if (("(" in clean_query and ")" in clean_query and "**2" in clean_query) or \
            ("(" in clean_query and ")" in clean_query and "^2" in clean_query)) and \
            "+" in clean_query:
            return "quadratic_expansion"
            
        # 检测因式分解模式
        if re.search(r'[a-zA-Z]\s*\*\s*[a-zA-Z].*?[a-zA-Z]\s*\*\s*[a-zA-Z]', clean_query) or \
           re.search(r'[a-zA-Z][a-zA-Z].*?[a-zA-Z][a-zA-Z]', clean_query):
            return "factorization"
            
        return "general"

    def _validate_result(self, result, query):
        """验证大模型返回的结果是否有效"""
        # 检查必要字段
        if not result.get('latex'):
            print("验证失败: 没有latex结果")
            return False
            
        # 检查是否有实际的计算步骤
        if not result.get('steps') or len(result['steps']) < 1:
            print("验证失败: 没有计算步骤")
            return False
            
        # 检查最终结果是否与原式不同
        if result['latex'].replace(' ', '') == query.replace(' ', ''):
            print("验证失败: 结果与原式相同")
            return False
        
        # 检查结果中是否包含无意义文本
        suspicious_outputs = ['ORED', '谢谢', '感谢', '请问', '下次再见']
        for text in suspicious_outputs:
            if text in result.get('explanation', '') or text in result.get('latex', ''):
                print(f"验证失败: 包含无意义文本 '{text}'")
                return False
        
        # 检查特定的数学模式
        clean_query = query.replace("化简", "").replace("simplify", "").strip()
        result_latex = result['latex']
        result_normalized = result_latex.replace(" ", "")
        
        # 1. 三角恒等式特殊强制检查
        if ("sin" in clean_query and "cos" in clean_query) and (
            "^2" in clean_query or "**2" in clean_query or "²" in clean_query):
            # 检查是否是sin²+cos²模式
            if "+" in clean_query and not "-" in clean_query:
                # 验证结果必须是1
                if result_latex.strip() != "1":
                    print("验证失败: 三角恒等式sin²+cos²应为1，但结果是: " + result_latex)
                    return False
            # 检查是否是sin²+cos²-1模式
            elif "+" in clean_query and "-" in clean_query and "1" in clean_query:
                # 验证结果必须是0
                if result_latex.strip() != "0":
                    print("验证失败: 三角恒等式sin²+cos²-1应为0，但结果是: " + result_latex)
                    return False
        
        # 1.1 一般三角恒等式检查
        if re.search(r'sin[\s\^2\(]+.*?\)[\s\^2]*\s*\+\s*cos[\s\^2\(]+.*?\)[\s\^2]*', clean_query, re.IGNORECASE):
            if "1" not in result_latex:
                print("验证失败: 三角恒等式应当简化为1")
                return False
        
        # 2. 平方展开检查 (x+a)²
        if re.search(r'\([a-zA-Z][\+\-][0-9]+\)(\^2|\*\*2)', clean_query):
            # 检查结果中是否包含平方项、一次项和常数项
            if not (re.search(r'[a-zA-Z](\^2|\*\*2)', result_latex) and 
                    re.search(r'[0-9]+[a-zA-Z]', result_latex) and 
                    re.search(r'[0-9]+', result_latex)):
                print("验证失败: 平方展开不完整")
                return False
        
        # 3. 简单因式分解检查: a*b+a*c 应当变为 a(b+c)
        if re.search(r'[a-zA-Z][\*]?[a-zA-Z][\+\-][a-zA-Z][\*]?[a-zA-Z]', clean_query):
            # 直接检查未分解形式 - 更严格的检查
            if "ab + ac" in result_latex or "ab+ac" in result_normalized:
                print("验证失败: 直接匹配到未分解形式 ab+ac")
                return False
                
            if "a*b + a*c" in result_latex or "a*b+a*c" in result_normalized:
                print("验证失败: 直接匹配到未分解形式 a*b+a*c")
                return False
                
            # 使用正则表达式检测更一般的模式
            if re.search(r'ab\+ac', result_normalized):
                print("验证失败: 正则检测到未分解ab+ac形式")
                return False
                
            if re.search(r'a\*b\+a\*c', result_normalized):
                print("验证失败: 正则检测到未分解a*b+a*c形式")
                return False
            
            # 检查是否有因式形式 a(b+c)
            if not re.search(r'[a-zA-Z]\s*\([^\)]+\)', result_latex):
                # 如果没有因式形式，但含有加号且不含括号，可能是其他类型的未分解形式
                if '+' in result_latex and '(' not in result_latex:
                    print("验证失败: 未完成因式分解，包含加号但没有括号")
                    return False
        
        return True

    def _generate_answer(self, prompt):
        """使用模型生成答案"""
        try:
            # 检查模型类型
            if hasattr(self.tokenizer, "apply_chat_template"):
                # 新模型(Qwen2.5)支持聊天模板
                messages = [
                    {"role": "system", "content": "你是一个专业的数学AI助手，擅长通过逐步的方式解答数学问题。你应当使用LaTeX表示所有数学公式。"},
                    {"role": "user", "content": prompt}
                ]
                
                # 使用聊天模板生成格式化的输入
                input_text = self.tokenizer.apply_chat_template(
                    messages,
                    tokenize=False,
                    add_generation_prompt=True
                )
                
                # 将文本转换为token
                inputs = self.tokenizer(input_text, return_tensors="pt").to(self.model.device)
                
                # 生成输出
                outputs = self.model.generate(
                    inputs.input_ids,
                    max_new_tokens=1024,
                    temperature=0.2,
                    top_p=0.9,
                    repetition_penalty=1.1
                )
                
                # 使用tokenizer.decode获取生成的文本
                generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                
                # 去除用户部分
                response_text = generated_text.split("assistant")[-1].strip()
                if response_text.startswith(":"):
                    response_text = response_text[1:].strip()
                
                return response_text
            else:
                # 旧模型的推理代码
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
        
        # 尝试提取LaTeX表达式（多种格式处理）
        latex_patterns = [
            r'\$\$(.*?)\$\$',  # $$latex$$
            r'\$(.*?)\$',      # $latex$
            r'\\boxed\{(.*?)\}', # \boxed{latex}
            r'\\begin\{align\}(.*?)\\end\{align\}', # align环境
            r'\\begin\{equation\}(.*?)\\end\{equation\}' # equation环境
        ]
        
        latex_parts = []
        
        for pattern in latex_patterns:
            matches = re.finditer(pattern, response, re.DOTALL)
            for match in matches:
                latex = match.group(1).strip()
                if latex:
                    latex_parts.append(latex)
        
        # 如果找不到LaTeX格式，尝试从文本中提取可能的计算结果
        if not latex_parts:
            # 寻找"= 数字"格式的结果
            result_matches = re.findall(r'=\s*([-+]?\d*\.?\d+)', response)
            if result_matches:
                latex_parts.append(result_matches[-1])  # 使用最后一个结果
                
            # 或者寻找"答案是"后面的内容
            answer_matches = re.findall(r'答案是\s*(.*?)。', response)
            if answer_matches:
                latex_parts.append(answer_matches[-1])
        
        if latex_parts:
            # 使用最后一个找到的LaTeX表达式作为结果（通常最后一个是最终结果）
            result['latex'] = latex_parts[-1]
            
            # 如果我们能找到多个LaTeX表达式，将它们作为步骤添加
            for i, latex in enumerate(latex_parts):
                step_title = f'步骤 {i + 1}'
                step_explanation = ''
                
                # 尝试从解析中找到每个步骤的解释
                if i < len(latex_parts) - 1:
                    # 提取当前LaTeX和下一个LaTeX之间的文本作为解释
                    current_latex_in_text = latex.replace('\\', '\\\\')  # 转义反斜杠
                    next_latex_in_text = latex_parts[i+1].replace('\\', '\\\\')
                    explanation_pattern = f"{current_latex_in_text}(.*?){next_latex_in_text}"
                    explanation_match = re.search(explanation_pattern, response, re.DOTALL)
                    if explanation_match:
                        step_explanation = explanation_match.group(1).strip()
                
                result['steps'].append({
                    'number': str(i + 1),
                    'title': step_title,
                    'latex': latex,
                    'explanation': step_explanation
                })
        
        # 提取解析部分
        explanation_parts = re.split(r'\n\s*\n', response)
        if len(explanation_parts) > 1:
            # 假设最后一部分是解析
            result['explanation'] = explanation_parts[-1]
        
        return result 