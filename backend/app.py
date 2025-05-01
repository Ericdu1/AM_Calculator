from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from api.math_solver import MathSolver

app = Flask(__name__)
CORS(app)

# 初始化数学求解器
math_solver = MathSolver()

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ready',
        'version': '1.0.0'
    })

@app.route('/api/solve', methods=['POST'])
def solve():
    """处理数学问题求解请求"""
    if not request.json or 'query' not in request.json:
        return jsonify({'error': '请提供数学问题查询'}), 400
        
    query = request.json['query']
    try:
        result = math_solver.solve(query)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 