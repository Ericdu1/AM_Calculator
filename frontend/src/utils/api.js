import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000 // 5秒超时
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    window.dispatchEvent(new CustomEvent('api-loading-start'));
    return config;
  },
  error => {
    window.dispatchEvent(new CustomEvent('api-loading-end'));
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    window.dispatchEvent(new CustomEvent('api-loading-end'));
    return response;
  },
  error => {
    window.dispatchEvent(new CustomEvent('api-loading-end'));
    return Promise.reject(error);
  }
);

// 数学问题求解
export const solveMathProblem = async (problem) => {
  try {
    const response = await api.post('/api/solve', { query: problem });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 检查计算器状态
export const checkCalculatorStatus = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data.status === 'ready';
  } catch (error) {
    return false;
  }
};

export default api; 