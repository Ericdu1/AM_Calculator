from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import time
from api.math_solver import MathSolver

# 初始化Flask应用
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# 初始化数学解决器
math_solver = None

@app.route('/api/solve', methods=['POST'])
def solve():
    """处理数学问题求解请求"""
    if not request.json or 'query' not in request.json:
        return jsonify({'error': '请提供数学问题查询'}), 400
    
    query = request.json['query']
    
    try:
        # 使用数学解决器处理查询
        result = math_solver.solve(query)
        return jsonify(result)
    except Exception as e:
        print(f"求解错误: {str(e)}", file=sys.stderr)
        return jsonify({'error': f'求解失败: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """简单的健康检查端点"""
    return jsonify({"status": "ok", "timestamp": time.time()})

def initialize_model():
    """初始化数学解决器模型"""
    global math_solver
    
    try:
        print("初始化数学解决器...")
        math_solver = MathSolver()
        print("数学解决器初始化成功")
    except Exception as e:
        print(f"数学解决器初始化失败: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    initialize_model()
    app.run(debug=True, host='0.0.0.0', port=5000) 