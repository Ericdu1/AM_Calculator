import os
import sys
import re
import time

class MathSolver:
    """Qwen2.5-Math AI Calculator (No SymPy/NumPy)"""
    def __init__(self):
        print("Initializing Qwen2.5-Math AI Calculator")
        self.result_cache = {}
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            model_name = "Qwen/Qwen2.5-Math-7B"
            print(f"Loading model: {model_name}")
            self.model = AutoModelForCausalLM.from_pretrained(model_name, device_map={"": "cpu"}, trust_remote_code=True)
            self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Model loading failed: {str(e)}")
            self.model = None
            self.tokenizer = None

    def solve(self, query):
        """主入口：仅用Qwen2.5-Math大模型推理"""
        query = self._normalize_query(query)
        if not self.model or not self.tokenizer:
            return self._create_error_response(query, "AI模型未加载")
        if query in self.result_cache:
            return self.result_cache[query]
        try:
            prompt = self._build_prompt(query)
            response = self._call_qwen(prompt)
            result = self._parse_response(response)
            # 简单格式校验
            if not result['latex'] or not result['steps']:
                result['success'] = False
                result['explanation'] = "AI未能正确解析，请尝试换种表达方式。"
            self.result_cache[query] = result
            return result
        except Exception as e:
            print(f"AI推理异常: {str(e)}")
            return self._create_error_response(query, str(e))

    def _normalize_query(self, query):
        query = ' '.join(query.split())
        replacements = {
            '^': '**',
            '×': '*',
            '÷': '/',
            '（': '(',
            '）': ')',
            '²': '**2',
            '³': '**3',
            '·': '*'
        }
        for old, new in replacements.items():
            query = query.replace(old, new)
        return query

    def _build_prompt(self, query):
        return f"""你是一个专业的数学AI助手，请详细解答下列数学问题：\n\n问题：{query}\n\n要求：\n1. 给出详细的解题步骤，每一步都用LaTeX公式表示。\n2. 最终答案用LaTeX公式高亮显示。\n3. 结尾给出简明的AI解析说明。\n4. 只输出数学相关内容，不要输出与数学无关的内容。\n\n解答："""

    def _call_qwen(self, prompt):
        messages = [
            {"role": "system", "content": "你是一个专业的数学AI助手，擅长通过逐步的方式解答数学问题。"},
            {"role": "user", "content": prompt}
        ]
        input_text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        inputs = self.tokenizer(input_text, return_tensors="pt").to(self.model.device)
        outputs = self.model.generate(
            inputs.input_ids,
            max_new_tokens=1024,
            temperature=0.1,
            top_p=0.95,
            repetition_penalty=1.1
        )
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        if "assistant" in response:
            response = response.split("assistant")[-1].strip()
            if response.startswith(":"):
                response = response[1:].strip()
        return response

    def _parse_response(self, response):
        result = {
            'success': True,
            'latex': '',
            'steps': [],
            'explanation': ''
        }
        try:
            # 提取所有LaTeX公式
            latex_matches = re.finditer(r'\$(.*?)\$|\\\[(.*?)\\\]|\\\((.*?)\\\)', response, re.DOTALL)
            latex_parts = []
            for match in latex_matches:
                latex = match.group(1) or match.group(2) or match.group(3)
                if latex and latex.strip():
                    latex_parts.append(latex.strip())
            if latex_parts:
                result['latex'] = latex_parts[-1]
                step_number = 1
                for latex in latex_parts[:-1]:
                    step = {
                        'number': str(step_number),
                        'title': f'步骤 {step_number}',
                        'latex': latex,
                        'explanation': ''
                    }
                    result['steps'].append(step)
                    step_number += 1
                result['steps'].append({
                    'number': str(step_number),
                    'title': '最终结果',
                    'latex': result['latex'],
                    'explanation': '计算完成'
                })
            # 提取AI解析说明
            explanations = re.split(r'\n\s*\n', response)
            if explanations:
                result['explanation'] = explanations[-1].strip()
            return result
        except Exception as e:
            print(f"解析AI输出失败: {str(e)}")
            result['success'] = False
            result['explanation'] = "AI输出解析失败"
            return result

    def _create_error_response(self, query, msg):
        return {
            'success': False,
            'latex': query,
            'explanation': f'AI计算失败：{msg}',
            'steps': [
                {
                    'number': '1',
                    'title': '输入验证',
                    'latex': query,
                    'explanation': 'AI模型未能给出有效答案'
                }
            ]
        } 