import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">正在初始化 AI 计算器</h2>
        <p className="text-gray-300">请稍候，正在加载模型...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 