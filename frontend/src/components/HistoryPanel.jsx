import { useState, useEffect } from 'react';

const HistoryPanel = ({ darkMode, history, onSelectHistoryItem, onClearHistory }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 截取一部分文本以避免显示过长
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
      <div 
        className={`px-6 py-3 ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} flex justify-between items-center cursor-pointer`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-xl font-bold">计算历史</h3>
        <span>{isCollapsed ? '▼' : '▲'}</span>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          {history && history.length > 0 ? (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={onClearHistory}
                  className={`px-3 py-1 rounded text-sm ${
                    darkMode 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  清除历史
                </button>
              </div>
              <ul className={`space-y-2 max-h-60 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                {history.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => onSelectHistoryItem(item)}
                    className={`p-3 rounded-lg cursor-pointer hover:${
                      darkMode ? 'bg-gray-600' : 'bg-blue-100'
                    } ${darkMode ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}
                  >
                    <div className="flex-1">
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {truncateText(item.query)}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`ml-2 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      使用
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              暂无计算历史
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel; 