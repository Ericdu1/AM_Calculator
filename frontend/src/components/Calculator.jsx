import { useState, useEffect } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import MathKeypad from './MathKeypad'
import StepByStepSolution from './StepByStepSolution'
import FormulaLibrary from './FormulaLibrary'
import HistoryPanel from './HistoryPanel'
import useLocalStorage from '../hooks/useLocalStorage'
import LoadingScreen from './LoadingScreen'

const Calculator = ({ darkMode }) => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('calculator')
  const [isModelReady, setIsModelReady] = useState(false)
  // 使用自定义hook存储历史记录
  const [history, setHistory] = useLocalStorage('mathCalculatorHistory', [])

  // 检查 AI 模型状态
  useEffect(() => {
    checkModelStatus()
  }, [])

  const checkModelStatus = async () => {
    try {
      const response = await axios.get('/api/health')
      if (response.data.status === 'ready') {
        setIsModelReady(true)
        setLoading(false)
      } else {
        setTimeout(checkModelStatus, 2000) // 每2秒检查一次
      }
    } catch (err) {
      setError('AI 模型加载失败，请刷新页面重试')
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setError(null)
  }

  const handleKeypadInput = (symbol) => {
    setInput((prev) => prev + symbol)
    setError(null)
  }

  // 添加到历史记录的函数
  const addToHistory = (query, result) => {
    // 创建新的历史记录条目
    const historyItem = {
      query,
      result,
      timestamp: new Date().toISOString()
    }
    
    // 更新历史记录，最新的记录在前面
    setHistory(prev => {
      // 限制历史记录最多20条
      const newHistory = [historyItem, ...prev]
      if (newHistory.length > 20) {
        return newHistory.slice(0, 20)
      }
      return newHistory
    })
  }

  // 清除所有历史记录
  const handleClearHistory = () => {
    setHistory([])
  }

  // 从历史记录加载一个计算
  const handleSelectHistoryItem = (item) => {
    setInput(item.query)
    setResult(item.result)
    setError(null)
    // 切换到计算器选项卡
    setActiveTab('calculator')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim()) {
      setError('请输入数学问题')
      return
    }
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await axios.post('/api/solve', { query: input })
      if (response.data.error) {
        setError(response.data.error)
      } else {
        const resultData = response.data
        setResult(resultData)
        // 添加到历史记录
        addToHistory(input, resultData)
      }
    } catch (err) {
      console.error(err)
      setError('计算过程中出错，请检查您的输入并重试。')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError(null)
  }

  // 使用katex直接渲染LaTeX
  const renderLatex = (latex) => {
    if (!latex) return null;
    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
        fleqn: true, // 启用左对齐
        maxSize: 1.5, // 最大缩放比例
        minRuleThickness: 0.06, // 最小线宽
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}"
        }
      });
      return (
        <div 
          className={`katex-display ${darkMode ? 'text-gray-200' : 'text-gray-800'} scrollbar-${darkMode ? 'dark' : 'light'}`}
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      );
    } catch (error) {
      console.error("LaTeX渲染错误:", error);
      return (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'} border-l-4 border-red-500`}>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>LaTeX渲染错误: {latex}</span>
          </div>
        </div>
      );
    }
  };

  const renderError = (error) => {
    if (!error) return null;
    
    return (
      <div className={`mt-4 p-4 rounded-lg border-l-4 ${darkMode ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50'} transition-all duration-300`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
              计算错误
            </h3>
            <div className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              {error}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setError(null)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white' 
                    : 'bg-red-100 hover:bg-red-200 focus:ring-red-500 text-red-800'
                }`}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isModelReady) {
    return <LoadingScreen />;
  }

  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
      <div className="p-0">
        {/* 顶部导航栏 */}
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
          <h2 className="text-2xl font-bold text-center">数学AI计算器</h2>
        </div>
        
        {/* 标签页切换 */}
        <div className={`flex border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'calculator'
                ? (darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-500 text-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            } border-b-2 ${activeTab === 'calculator' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('calculator')}
          >
            计算器
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'formulas'
                ? (darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-500 text-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            } border-b-2 ${activeTab === 'formulas' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('formulas')}
          >
            公式库
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'favorites'
                ? (darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-500 text-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            } border-b-2 ${activeTab === 'favorites' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('favorites')}
          >
            收藏夹
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'history'
                ? (darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-500 text-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            } border-b-2 ${activeTab === 'history' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('history')}
          >
            历史记录
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'calculator' ? (
            // 计算器内容
            <>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                  <label htmlFor="math-input" className="block mb-2 font-medium text-lg">
                    输入数学问题
                  </label>
                  <div className={`rounded-lg overflow-hidden border-2 ${darkMode ? 'border-gray-600' : 'border-blue-300'} focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200`}>
                    <textarea
                      id="math-input"
                      value={input}
                      onChange={handleInputChange}
                      className={`w-full p-4 focus:outline-none font-medium text-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                      placeholder="例如：求 ∫sin(x)dx 或 求解方程 x^2+3x-4=0"
                      rows={4}
                    />
                  </div>
                </div>
                
                <MathKeypad onSymbolClick={handleKeypadInput} darkMode={darkMode} />
                
                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className={`flex-1 py-3 px-6 rounded-lg text-white font-medium text-lg shadow-lg transition-all duration-200 ${
                      loading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        计算中...
                      </span>
                    ) : '计算'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`py-3 px-6 rounded-lg font-medium text-lg shadow-md transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                  >
                    清除
                  </button>
                </div>
              </form>
              
              {renderError(error)}
              
              {/* 如果有历史记录，显示一个折叠的历史面板 */}
              {history.length > 0 && !loading && !error && (
                <div className="mb-6 mt-6">
                  <HistoryPanel 
                    darkMode={darkMode} 
                    history={history.slice(0, 3)} 
                    onSelectHistoryItem={handleSelectHistoryItem}
                    onClearHistory={() => setActiveTab('history')}
                  />
                </div>
              )}
              
              {result && !error && (
                <div className={`mt-8 rounded-xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className={`px-6 py-3 ${darkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
                    <h3 className="text-xl font-bold">计算结果</h3>
                  </div>
                  
                  <div className="p-6">
                    {result.latex && (
                      <div className="mb-6 overflow-x-auto py-4 px-6 rounded-lg bg-opacity-50 bg-white dark:bg-gray-800 dark:bg-opacity-50">
                        {renderLatex(result.latex)}
                      </div>
                    )}
                    
                    {result.steps && result.steps.length > 0 && (
                      <StepByStepSolution steps={result.steps} darkMode={darkMode} />
                    )}
                    
                    {result.explanation && (
                      <div className="mt-8">
                        <div className={`px-4 py-2 ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} rounded-t-lg`}>
                          <h4 className="text-lg font-bold">AI解析</h4>
                        </div>
                        <div className={`p-5 rounded-b-lg ${darkMode ? 'bg-gray-600 bg-opacity-50 text-gray-200' : 'bg-white text-gray-700'} border ${darkMode ? 'border-gray-600' : 'border-blue-100'}`}>
                          {result.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : activeTab === 'history' ? (
            // 历史记录内容
            <div className="mb-6">
              <HistoryPanel 
                darkMode={darkMode} 
                history={history} 
                onSelectHistoryItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
              />
            </div>
          ) : activeTab === 'favorites' ? (
            // 收藏夹内容
            <FormulaLibrary darkMode={darkMode} showFavoritesOnly={true} />
          ) : (
            // 公式库内容
            <FormulaLibrary darkMode={darkMode} showFavoritesOnly={false} />
          )}
        </div>
        
        {/* 底部版权信息 */}
        <div className={`px-6 py-3 text-center text-sm ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
          © 2024 数学AI计算器 | 基于 Qwen2.5-Math
        </div>
      </div>
    </div>
  )
}

export default Calculator 