from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import time
from api.math_solver import MathSolver

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# 全局初始化模型，兼容flask run和python app.py
print("初始化数学解决器...")
math_solver = MathSolver()
print("数学解决器初始化成功")

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
        print(f"求解错误: {str(e)}", file=sys.stderr)
        return jsonify({'error': f'求解失败: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """简单的健康检查端点"""
    return jsonify({"status": "ok", "timestamp": time.time()})

# 兼容 flask run 和 python app.py 两种启动方式
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 