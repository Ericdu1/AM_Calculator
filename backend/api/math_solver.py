import os
import sys
import re
import numpy as np
from sympy import *
from typing import Dict, Any, List, Tuple
from .math_knowledge import MathKnowledge

class MathSolver:
    """基础数学计算器，使用 SymPy 和 NumPy"""
    def __init__(self):
        self.result_cache = {}
        self.math_knowledge = MathKnowledge()
        # 初始化符号
        self.x, self.y, self.z = symbols('x y z')
        self.a, self.b, self.c = symbols('a b c')
        self.n = symbols('n', integer=True)
        self.t = symbols('t')  # 参数方程参数
        self.theta = symbols('theta')  # 极坐标角度
        self.r = symbols('r')  # 极坐标半径
        
    def is_ready(self) -> bool:
        """检查计算器是否就绪"""
        return True  # SymPy 和 NumPy 总是就绪的

    def _convert_equation(self, expr: str, target_form: str) -> Dict[str, Any]:
        """转换方程格式"""
        try:
            # 解析表达式
            expr = sympify(expr)
            result = None
            steps = []
            
            # 根据目标形式选择转换方法
            if '直线' in target_form:
                result = self._convert_line_equation(expr, target_form)
            elif '圆锥曲线' in target_form:
                result = self._convert_conic_equation(expr, target_form)
            elif '参数方程' in target_form:
                result = self._convert_to_parametric(expr, target_form)
            elif '极坐标' in target_form:
                result = self._convert_to_polar(expr)
            elif '复数' in target_form:
                result = self._convert_complex_number(expr, target_form)
            
            # 获取转换步骤
            steps = self.math_knowledge.get_conversion_steps(str(expr), target_form)
            
            return {
                'success': True,
                'original': latex(expr),
                'result': latex(result) if result else None,
                'steps': steps,
                'type': 'conversion'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'转换失败：{str(e)}',
                'type': 'error'
            }

    def _convert_line_equation(self, expr: Expr, target_form: str) -> Expr:
        """转换直线方程"""
        # 提取系数
        coeffs = collect(expr, [self.x, self.y], evaluate=False)
        
        if '一般式' in target_form:
            # 转换为 Ax + By + C = 0
            return self._to_general_form(coeffs)
        elif '点斜式' in target_form:
            # 转换为 y - y1 = k(x - x1)
            return self._to_point_slope_form(coeffs)
        elif '斜截式' in target_form:
            # 转换为 y = kx + b
            return self._to_slope_intercept_form(coeffs)
        else:
            raise ValueError(f'不支持的直线方程格式：{target_form}')

    def _convert_conic_equation(self, expr: Expr, target_form: str) -> Expr:
        """转换圆锥曲线方程"""
        # 配方法转换为标准型
        x_terms = collect(expr, self.x, evaluate=False)
        y_terms = collect(expr, self.y, evaluate=False)
        
        if '圆' in target_form:
            # 转换为 (x-h)² + (y-k)² = r²
            return self._to_circle_standard_form(x_terms, y_terms)
        elif '椭圆' in target_form:
            # 转换为 x²/a² + y²/b² = 1
            return self._to_ellipse_standard_form(x_terms, y_terms)
        elif '双曲线' in target_form:
            # 转换为 x²/a² - y²/b² = 1
            return self._to_hyperbola_standard_form(x_terms, y_terms)
        elif '抛物线' in target_form:
            # 转换为 y² = 2px 或 x² = 2py
            return self._to_parabola_standard_form(x_terms, y_terms)
        else:
            raise ValueError(f'不支持的圆锥曲线格式：{target_form}')

    def _convert_to_parametric(self, expr: Expr, target_form: str) -> Tuple[Expr, Expr]:
        """转换为参数方程"""
        if isinstance(expr, Equality):
            # 从隐式方程转换为参数方程
            lhs, rhs = expr.args
            if '直线' in target_form:
                # 使用点和方向向量
                point = (0, solve(expr.subs(self.x, 0), self.y)[0])
                direction = (-expr.coeff(self.y), expr.coeff(self.x))
                return (
                    point[0] + direction[0]*self.t,
                    point[1] + direction[1]*self.t
                )
            elif '圆' in target_form:
                # 使用圆心和半径
                center = self._find_circle_center(expr)
                radius = self._find_circle_radius(expr)
                return (
                    center[0] + radius*cos(self.t),
                    center[1] + radius*sin(self.t)
                )
        raise ValueError('无法转换为参数方程')

    def _convert_to_polar(self, expr: Expr) -> Expr:
        """转换为极坐标方程"""
        # 替换 x = r*cos(theta), y = r*sin(theta)
        polar_expr = expr.subs([
            (self.x, self.r*cos(self.theta)),
            (self.y, self.r*sin(self.theta))
        ])
        return solve(polar_expr, self.r)[0]

    def _convert_complex_number(self, expr: Expr, target_form: str) -> Expr:
        """转换复数表示"""
        if '三角形式' in target_form:
            # 转换为 r(cos θ + i sin θ)
            re, im = re(expr), im(expr)
            r = sqrt(re**2 + im**2)
            theta = atan2(im, re)
            return r*(cos(theta) + I*sin(theta))
        elif '指数形式' in target_form:
            # 转换为 re^(iθ)
            re, im = re(expr), im(expr)
            r = sqrt(re**2 + im**2)
            theta = atan2(im, re)
            return r*exp(I*theta)
        elif '代数形式' in target_form:
            # 已经是代数形式，直接返回
            return expr
        else:
            raise ValueError(f'不支持的复数格式：{target_form}')

    def _to_general_form(self, coeffs: Dict) -> Expr:
        """转换为一般式 Ax + By + C = 0"""
        A = coeffs.get(self.x, 0)
        B = coeffs.get(self.y, 0)
        C = coeffs.get(1, 0)
        return A*self.x + B*self.y + C

    def _to_point_slope_form(self, coeffs: Dict) -> Expr:
        """转换为点斜式 y - y1 = k(x - x1)"""
        A = coeffs.get(self.x, 0)
        B = coeffs.get(self.y, 0)
        C = coeffs.get(1, 0)
        k = -A/B
        x1, y1 = 0, -C/B
        return self.y - y1 - k*(self.x - x1)

    def _to_slope_intercept_form(self, coeffs: Dict) -> Expr:
        """转换为斜截式 y = kx + b"""
        A = coeffs.get(self.x, 0)
        B = coeffs.get(self.y, 0)
        C = coeffs.get(1, 0)
        k = -A/B
        b = -C/B
        return self.y - k*self.x - b

    def _find_circle_center(self, expr: Expr) -> Tuple[Expr, Expr]:
        """找到圆的中心"""
        x_terms = collect(expr, self.x, evaluate=False)
        y_terms = collect(expr, self.y, evaluate=False)
        h = -x_terms.get(self.x, 0)/2
        k = -y_terms.get(self.y, 0)/2
        return (h, k)

    def _find_circle_radius(self, expr: Expr) -> Expr:
        """找到圆的半径"""
        center = self._find_circle_center(expr)
        r_squared = expr.subs([
            (self.x, center[0]),
            (self.y, center[1])
        ])
        return sqrt(abs(r_squared))

    def solve(self, query: str) -> Dict[str, Any]:
        """使用 SymPy 和 NumPy 解决数学问题"""
        query = self._normalize_query(query)
        
        # 检查缓存
        if query in self.result_cache:
            return self.result_cache[query]

        try:
            # 获取关键词
            keywords = self.math_knowledge.get_keywords(query)
            
            # 处理转换请求
            if any(k in ['格式转换', '标准型', '一般式', '点斜式', '斜截式', '参数方程', '极坐标'] for k in keywords):
                # 提取表达式和目标格式
                parts = query.split('转换为')
                if len(parts) != 2:
                    raise ValueError('转换格式不正确，请使用"转换为"分隔表达式和目标格式')
                
                expr = parts[0].strip()
                target_form = parts[1].strip()
                result = self._convert_equation(expr, target_form)
                
                # 添加转换方法说明
                if result['success']:
                    method = self.math_knowledge.get_conversion_methods(
                        self._get_expression_type(expr),
                        target_form
                    )
                    result['method'] = method
                
                return result
            
            # 处理其他类型的问题
            if '解方程' in keywords:
                result = self._solve_equation(query)
            elif '积分' in keywords:
                result = self._solve_integral(query)
            elif '导数' in keywords:
                result = self._solve_derivative(query)
            elif '极限' in keywords:
                result = self._solve_limit(query)
            elif '矩阵' in keywords:
                result = self._solve_matrix(query)
            elif '化简' in keywords:
                result = self._simplify_expression(query)
            else:
                # 默认尝试计算表达式
                result = self._calculate_expression(query)
            
            # 生成解析
            result['explanation'] = self.math_knowledge.generate_explanation(query, result)
            
            # 获取相关公式建议
            result['formula_suggestions'] = self.math_knowledge.get_formula_suggestions(query)
            
            # 缓存结果
            if result['success']:
                self.result_cache[query] = result
            
            return result
        except Exception as e:
            print(f"计算错误: {str(e)}", file=sys.stderr)
            return self._create_error_response(query, str(e))

    def _get_expression_type(self, expr: str) -> str:
        """判断表达式类型"""
        if 'x' in expr and 'y' in expr:
            if '^2' in expr or '²' in expr:
                return '圆锥曲线'
            return '直线方程'
        elif 'i' in expr or 'I' in expr:
            return '复数'
        return '一般表达式'

    def _normalize_query(self, query: str) -> str:
        """规范化查询字符串"""
        # 替换中文符号
        replacements = {
            '×': '*',
            '÷': '/',
            '（': '(',
            '）': ')',
            '【': '[',
            '】': ']',
            '，': ',',
            '；': ';',
            '：': ':',
            '＝': '=',
            '＋': '+',
            '－': '-',
            '^': '**',
            '²': '**2',
            '³': '**3',
            'π': 'pi',
            '∞': 'oo'
        }
        for old, new in replacements.items():
            query = query.replace(old, new)
        return query.strip()

    def _solve_equation(self, query: str) -> Dict[str, Any]:
        """解方程"""
        # 提取方程
        equation = query.replace('解方程', '').replace('求解', '').strip()
        if '=' not in equation:
            equation = equation + '=0'
        
        # 解析方程
        lhs, rhs = equation.split('=')
        expr = sympify(f"{lhs}-({rhs})")
        
        # 求解
        solutions = solve(expr, self.x)
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原方程', 'latex': latex(expr), 'explanation': '原始方程'},
            {'number': '2', 'title': '解', 'latex': latex(solutions), 'explanation': '方程的解'}
        ]
        
        return {
            'success': True,
            'latex': latex(solutions),
            'explanation': f'方程 {equation} 的解为：{solutions}',
            'steps': steps,
            'source': 'sympy',
            'type': 'equation'
        }

    def _solve_integral(self, query: str) -> Dict[str, Any]:
        """计算积分"""
        # 提取积分表达式
        expr_str = query.replace('积分', '').replace('∫', '').strip()
        expr = sympify(expr_str)
        
        # 计算积分
        integral = integrate(expr, self.x)
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '被积函数'},
            {'number': '2', 'title': '积分结果', 'latex': latex(integral), 'explanation': '积分结果'}
        ]
        
        return {
            'success': True,
            'latex': latex(integral),
            'explanation': f'∫{expr_str}dx = {integral}',
            'steps': steps,
            'source': 'sympy',
            'type': 'integral'
        }

    def _solve_derivative(self, query: str) -> Dict[str, Any]:
        """计算导数"""
        # 提取表达式
        expr_str = query.replace('导数', '').replace('微分', '').strip()
        expr = sympify(expr_str)
        
        # 计算导数
        derivative = diff(expr, self.x)
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '原函数'},
            {'number': '2', 'title': '导数', 'latex': latex(derivative), 'explanation': '导数结果'}
        ]
        
        return {
            'success': True,
            'latex': latex(derivative),
            'explanation': f'd/dx({expr_str}) = {derivative}',
            'steps': steps,
            'source': 'sympy',
            'type': 'derivative'
        }

    def _solve_limit(self, query: str) -> Dict[str, Any]:
        """计算极限"""
        # 提取极限表达式
        expr_str = query.replace('极限', '').replace('lim', '').strip()
        expr = sympify(expr_str)
        
        # 计算极限
        limit_result = limit(expr, self.x, 0)
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '极限表达式'},
            {'number': '2', 'title': '极限值', 'latex': latex(limit_result), 'explanation': '极限结果'}
        ]
        
        return {
            'success': True,
            'latex': latex(limit_result),
            'explanation': f'lim(x→0) {expr_str} = {limit_result}',
            'steps': steps,
            'source': 'sympy',
            'type': 'limit'
        }

    def _solve_matrix(self, query: str) -> Dict[str, Any]:
        """矩阵运算"""
        # 提取矩阵表达式
        expr_str = query.replace('矩阵', '').replace('行列式', '').strip()
        
        if '行列式' in query:
            # 计算行列式
            matrix = Matrix(eval(expr_str))
            det = matrix.det()
            
            # 生成步骤
            steps = [
                {'number': '1', 'title': '矩阵', 'latex': latex(matrix), 'explanation': '原矩阵'},
                {'number': '2', 'title': '行列式', 'latex': latex(det), 'explanation': '行列式值'}
            ]
            
            return {
                'success': True,
                'latex': latex(det),
                'explanation': f'行列式 |{expr_str}| = {det}',
                'steps': steps,
                'source': 'sympy',
                'type': 'determinant'
            }
        else:
            # 其他矩阵运算
            matrix = Matrix(eval(expr_str))
            
            # 生成步骤
            steps = [
                {'number': '1', 'title': '矩阵', 'latex': latex(matrix), 'explanation': '矩阵运算结果'}
            ]
            
            return {
                'success': True,
                'latex': latex(matrix),
                'explanation': f'矩阵运算结果：{matrix}',
                'steps': steps,
                'source': 'sympy',
                'type': 'matrix'
            }

    def _simplify_expression(self, query: str) -> Dict[str, Any]:
        """化简表达式"""
        expr_str = query.replace('化简', '').strip()
        expr = sympify(expr_str)
        simplified = simplify(expr)
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '原始表达式'},
            {'number': '2', 'title': '化简结果', 'latex': latex(simplified), 'explanation': '化简后的表达式'}
        ]
        
        return {
            'success': True,
            'latex': latex(simplified),
            'explanation': f'化简 {expr_str} = {simplified}',
            'steps': steps,
            'source': 'sympy',
            'type': 'simplify'
        }

    def _calculate_expression(self, query: str) -> Dict[str, Any]:
        """计算表达式"""
        expr = sympify(query)
        result = expr.evalf()
        
        # 生成步骤
        steps = [
            {'number': '1', 'title': '原式', 'latex': latex(expr), 'explanation': '原始表达式'},
            {'number': '2', 'title': '结果', 'latex': latex(result), 'explanation': '计算结果'}
        ]
        
        return {
            'success': True,
            'latex': latex(result),
            'explanation': f'计算结果：{result}',
            'steps': steps,
            'source': 'sympy',
            'type': 'calculation'
        }

    def _create_error_response(self, query: str, error_msg: str) -> Dict[str, Any]:
        """创建错误响应"""
        return {
            'success': False,
            'latex': query,
            'explanation': f'计算失败：{error_msg}',
            'steps': [
                {
                    'number': '1',
                    'title': '错误信息',
                    'latex': query,
                    'explanation': error_msg
                }
            ],
            'source': 'error',
            'type': 'error'
        } 