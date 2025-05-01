import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const HistoryPanel = ({ history, onSelectHistoryItem, onClearHistory, darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`mt-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      <div 
        className={`p-4 cursor-pointer flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg 
            className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            历史记录
          </h3>
        </div>
        <div className="flex items-center">
          <span className={`text-sm mr-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {history.length} 条记录
          </span>
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-4">
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-700/50 bg-gray-700/30' 
                        : 'hover:bg-gray-50 bg-gray-50/50'
                    }`}
                    onClick={() => onSelectHistoryItem(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.query}
                        </div>
                        <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: zhCN })}
                        </div>
                      </div>
                      <button
                        className={`ml-2 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                          darkMode 
                            ? 'hover:bg-gray-600 text-gray-400' 
                            : 'hover:bg-gray-200 text-gray-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHistoryItem(item);
                        }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                暂无历史记录
              </div>
            )}
            
            {history.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClearHistory}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  清除历史记录
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel; 