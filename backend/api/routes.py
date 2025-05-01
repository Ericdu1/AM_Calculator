from flask import Blueprint, request, jsonify
from .math_conversions import MathConversions
from .input_suggestions import InputSuggestions
from .math_knowledge import MathKnowledge

api = Blueprint('api', __name__)
math_conversions = MathConversions()
input_suggestions = InputSuggestions()
math_knowledge = MathKnowledge()

@api.route('/convert', methods=['POST'])
def convert_expression():
    """转换数学表达式"""
    data = request.get_json()
    expression = data.get('expression')
    expression_type = data.get('type')
    target_form = data.get('target_form')
    
    if not all([expression, expression_type, target_form]):
        return jsonify({
            'error': '缺少必要参数'
        }), 400
    
    try:
        if expression_type == '直线方程':
            result = math_conversions.convert_line_equation(expression, target_form)
        elif expression_type == '圆锥曲线':
            result = math_conversions.convert_conic_section(expression, target_form)
        elif expression_type == '复数':
            result = math_conversions.convert_complex_number(expression, target_form)
        elif expression_type == '坐标系':
            result = math_conversions.convert_coordinates(expression, target_form)
        else:
            return jsonify({
                'error': '不支持的表达式类型'
            }), 400
            
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@api.route('/suggestions', methods=['GET'])
def get_suggestions():
    """获取输入建议"""
    input_text = request.args.get('input', '')
    
    try:
        suggestions = input_suggestions.get_suggestions(input_text)
        formatted_suggestions = input_suggestions.format_suggestions(suggestions)
        
        return jsonify({
            'suggestions': formatted_suggestions
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@api.route('/formulas', methods=['GET'])
def get_formulas():
    """获取相关公式"""
    keywords = request.args.get('keywords', '').split(',')
    
    try:
        formulas = math_knowledge.get_relevant_formulas(keywords)
        return jsonify({
            'formulas': formulas
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@api.route('/conversion-types', methods=['GET'])
def get_conversion_types():
    """获取支持的转换类型"""
    return jsonify({
        'types': math_conversions.conversion_types
    })

@api.route('/templates', methods=['GET'])
def get_templates():
    """获取输入模板"""
    prefix = request.args.get('prefix', '')
    
    try:
        templates = math_knowledge.input_templates.get(prefix, [])
        return jsonify({
            'templates': templates
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500 