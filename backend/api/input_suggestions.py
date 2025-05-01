from typing import List, Dict
import re
from .math_knowledge import MathKnowledge

class InputSuggestions:
    """输入建议系统"""
    
    def __init__(self):
        self.math_knowledge = MathKnowledge()
        self.prefix_patterns = {
            '解': r'^解\s*(.*)$',
            '求': r'^求\s*(.*)$',
            '化': r'^化\s*(.*)$',
            '计': r'^计\s*(.*)$',
            '证': r'^证\s*(.*)$',
            '转': r'^转\s*(.*)$'
        }
        
    def get_suggestions(self, input_text: str) -> List[Dict]:
        """获取输入建议"""
        suggestions = []
        
        # 检查前缀匹配
        for prefix, pattern in self.prefix_patterns.items():
            match = re.match(pattern, input_text)
            if match:
                remaining = match.group(1).strip()
                suggestions.extend(self._get_prefix_suggestions(prefix, remaining))
                break
        
        # 如果没有前缀匹配，尝试关键词匹配
        if not suggestions:
            suggestions.extend(self._get_keyword_suggestions(input_text))
        
        return suggestions[:10]  # 限制返回数量
    
    def _get_prefix_suggestions(self, prefix: str, remaining: str) -> List[Dict]:
        """根据前缀获取建议"""
        suggestions = []
        templates = self.math_knowledge.input_templates.get(prefix, [])
        
        for template in templates:
            # 检查模板是否匹配当前输入
            if remaining and not template.lower().startswith(remaining.lower()):
                continue
                
            suggestion = {
                'text': template,
                'type': 'template',
                'prefix': prefix,
                'description': self._get_template_description(template)
            }
            suggestions.append(suggestion)
        
        return suggestions
    
    def _get_keyword_suggestions(self, input_text: str) -> List[Dict]:
        """根据关键词获取建议"""
        suggestions = []
        
        # 获取相关关键词
        keywords = self.math_knowledge.get_keywords(input_text)
        
        # 获取相关公式
        formulas = self.math_knowledge.get_relevant_formulas(keywords)
        
        for category, formula_dict in formulas.items():
            for name, details in formula_dict.items():
                if input_text.lower() in name.lower():
                    suggestion = {
                        'text': name,
                        'type': 'formula',
                        'category': category,
                        'description': details.get('explanation', '')
                    }
                    suggestions.append(suggestion)
        
        return suggestions
    
    def _get_template_description(self, template: str) -> str:
        """获取模板描述"""
        descriptions = {
            '解方程': '求解代数方程的解',
            '解不等式': '求解不等式的解集',
            '解三角方程': '求解三角方程的解',
            '求导数': '计算函数的导数',
            '求积分': '计算函数的积分',
            '求极限': '计算函数的极限值',
            '化简': '将表达式化简为最简形式',
            '化为标准型': '将表达式转换为标准形式',
            '计算': '计算表达式的值',
            '证明': '证明数学命题',
            '转换为标准型': '将表达式转换为标准形式',
            '转换为一般式': '将表达式转换为一般形式',
            '转换为参数方程': '将方程转换为参数形式',
            '转换为极坐标': '将坐标转换为极坐标形式'
        }
        
        for key, desc in descriptions.items():
            if key in template:
                return desc
        return '输入数学表达式'
    
    def format_suggestions(self, suggestions: List[Dict]) -> List[Dict]:
        """格式化建议列表用于显示"""
        formatted = []
        for suggestion in suggestions:
            formatted_suggestion = {
                'label': suggestion['text'],
                'detail': suggestion.get('description', ''),
                'type': suggestion['type'],
                'insertText': suggestion['text']
            }
            
            # 添加额外信息
            if suggestion['type'] == 'formula':
                formatted_suggestion['documentation'] = {
                    'category': suggestion['category'],
                    'formula': self.math_knowledge.formulas[suggestion['category']][suggestion['text']]['formula']
                }
            
            formatted.append(formatted_suggestion)
        
        return formatted 