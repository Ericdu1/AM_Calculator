import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import MathKeypad from './MathKeypad'
import StepByStepSolution from './StepByStepSolution'
import FormulaLibrary from './FormulaLibrary'
import HistoryPanel from './HistoryPanel'
import useLocalStorage from '../hooks/useLocalStorage'
import LoadingScreen from './LoadingScreen'
import { solveMathProblem, checkCalculatorStatus } from '../utils/api'

const Calculator = ({ darkMode }) => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('calculator')
  const [isReady, setIsReady] = useState(false)
  const [history, setHistory] = useLocalStorage('mathCalculatorHistory', [])
  const [keywords, setKeywords] = useState([])
  const [formulaSuggestions, setFormulaSuggestions] = useState([])
  const [inputSuggestions, setInputSuggestions] = useState([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef(null)

  // 检查计算器状态
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const ready = await checkCalculatorStatus()
        setIsReady(ready)
      } catch (err) {
        console.error('检查计算器状态失败:', err)
        setIsReady(false)
      }
    }
    checkStatus()
  }, [])

  // 处理输入建议
  useEffect(() => {
    const getInputSuggestions = async () => {
      try {
        const response = await axios.post('/api/suggestions', { prefix: input })
        setInputSuggestions(response.data.suggestions || [])
      } catch (err) {
        console.error('获取输入建议失败:', err)
        setInputSuggestions([])
      }
    }

    if (input.length > 0) {
      getInputSuggestions()
    } else {
      setInputSuggestions([])
    }
  }, [input])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    setError(null)
    setSelectedSuggestionIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (inputSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < inputSuggestions.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : inputSuggestions.length - 1
        )
      } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        e.preventDefault()
        handleSuggestionClick(inputSuggestions[selectedSuggestionIndex])
      } else if (e.key === 'Escape') {
        setInputSuggestions([])
        setSelectedSuggestionIndex(-1)
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
    setInputSuggestions([])
    setSelectedSuggestionIndex(-1)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeypadInput = (symbol) => {
    setInput((prev) => prev + symbol)
    setError(null)
  }

  const addToHistory = (query, result) => {
    const historyItem = {
      query,
      result,
      timestamp: new Date().toISOString()
    }
    
    setHistory(prev => {
      const newHistory = [historyItem, ...prev]
      if (newHistory.length > 20) {
        return newHistory.slice(0, 20)
      }
      return newHistory
    })
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleSelectHistoryItem = (item) => {
    setInput(item.query)
    setResult(item.result)
    setError(null)
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
    setKeywords([])
    setFormulaSuggestions([])
    
    try {
      const response = await solveMathProblem(input)
      if (response.error) {
        setError(response.error)
      } else {
        setResult(response)
        setKeywords(response.keywords || [])
        setFormulaSuggestions(response.formula_suggestions || [])
        addToHistory(input, response)
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
        fleqn: true,
        maxSize: 1.5,
        minRuleThickness: 0.06,
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

  if (!isReady) {
    return <LoadingScreen message="正在初始化计算器..." />;
  }

  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
      <div className="p-0">
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
          <h2 className="text-2xl font-bold text-center">数学计算器</h2>
        </div>
        
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
              activeTab === 'history'
                ? (darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-500 text-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            } border-b-2 ${activeTab === 'history' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('history')}
          >
            历史记录
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'calculator' ? (
            <>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4 relative">
                  <label htmlFor="math-input" className="block mb-2 font-medium text-lg">
                    输入数学问题
                  </label>
                  <div className={`rounded-lg overflow-hidden border-2 ${darkMode ? 'border-gray-600' : 'border-blue-300'} focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200`}>
                    <textarea
                      ref={inputRef}
                      id="math-input"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className={`w-full p-4 focus:outline-none font-medium text-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                      placeholder="例如：解方程 x^2+3x-4=0 或 计算积分 ∫sin(x)dx"
                      rows={4}
                    />
                    
                    {/* 输入建议下拉框 */}
                    {inputSuggestions.length > 0 && (
                      <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      } border ${
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        {inputSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className={`px-4 py-2 cursor-pointer ${
                              index === selectedSuggestionIndex
                                ? (darkMode ? 'bg-blue-600' : 'bg-blue-100')
                                : ''
                            } ${
                              darkMode
                                ? 'hover:bg-gray-600 text-gray-200'
                                : 'hover:bg-gray-100 text-gray-800'
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {keywords.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">识别到的关键词：</div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode
                              ? 'bg-blue-900/50 text-blue-300'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
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
              
              {formulaSuggestions.length > 0 && (
                <div className="mb-6">
                  <div className="text-lg font-medium mb-4">相关公式建议：</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formulaSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-gray-50 border-gray-200'
                        } border`}
                      >
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          {suggestion.category}
                        </div>
                        <div className="mb-2">
                          {renderLatex(suggestion.formula)}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {suggestion.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
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
                          <h4 className="text-lg font-bold">计算解析</h4>
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
            <div className="mb-6">
              <HistoryPanel 
                darkMode={darkMode} 
                history={history} 
                onSelectHistoryItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
              />
            </div>
          ) : (
            <FormulaLibrary darkMode={darkMode} />
          )}
        </div>
        
        <div className={`px-6 py-3 text-center text-sm ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
          © 2024 数学计算器 | 基于 SymPy 和 NumPy
        </div>
      </div>
    </div>
  )
}

export default Calculator 