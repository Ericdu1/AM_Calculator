from flask import Flask, request, jsonify
from flask_cors import CORS
from .math_solver import MathSolver
from .math_knowledge import MathKnowledge

app = Flask(__name__)
CORS(app)

solver = MathSolver()
knowledge = MathKnowledge()

@app.route('/api/health', methods=['GET'])
def health_check():
    """检查计算器状态"""
    return jsonify({
        'status': 'ready' if solver.is_ready() else 'initializing'
    })

@app.route('/api/solve', methods=['POST'])
def solve():
    """解决数学问题"""
    data = request.get_json()
    query = data.get('query', '')
    
    if not query:
        return jsonify({
            'error': '请输入数学问题'
        }), 400
    
    try:
        result = solver.solve(query)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    """获取输入建议"""
    data = request.get_json()
    prefix = data.get('prefix', '')
    
    if not prefix:
        return jsonify({
            'suggestions': []
        })
    
    try:
        suggestions = knowledge.get_input_suggestions(prefix)
        return jsonify({
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 