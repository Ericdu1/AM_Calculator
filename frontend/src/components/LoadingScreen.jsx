import React from 'react';

const LoadingScreen = ({ progress, message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center w-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">正在初始化 AI 计算器</h2>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        <p className="text-gray-300">{message || '请稍候，正在加载模型...'}</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 