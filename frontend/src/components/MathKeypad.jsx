import { useState } from 'react'

const MathKeypad = ({ onSymbolClick, darkMode }) => {
  const [activeTab, setActiveTab] = useState('basic')

  const symbolSets = {
    basic: [
      { symbol: '+', label: '+' },
      { symbol: '-', label: '-' },
      { symbol: '×', label: '×' },
      { symbol: '÷', label: '÷' },
      { symbol: '=', label: '=' },
      { symbol: '(', label: '(' },
      { symbol: ')', label: ')' },
      { symbol: '^', label: 'x^y' },
      { symbol: '√', label: '√' },
      { symbol: 'π', label: 'π' },
    ],
    calculus: [
      { symbol: '∫', label: '∫' },
      { symbol: '∫_{}^{}', label: '∫_a^b' },
      { symbol: '\\lim_{x\\to}', label: 'lim' },
      { symbol: '\\frac{d}{dx}', label: 'd/dx' },
      { symbol: '\\sum_{}^{}', label: 'Σ' },
      { symbol: '\\partial', label: '∂' },
      { symbol: '\\infty', label: '∞' },
      { symbol: '\\nabla', label: '∇' },
      { symbol: '\\Delta', label: 'Δ' },
      { symbol: '\\oint', label: '∮' },
    ],
    functions: [
      { symbol: '\\sin', label: 'sin' },
      { symbol: '\\cos', label: 'cos' },
      { symbol: '\\tan', label: 'tan' },
      { symbol: '\\ln', label: 'ln' },
      { symbol: '\\log', label: 'log' },
      { symbol: '\\exp', label: 'exp' },
      { symbol: '\\arcsin', label: 'arcsin' },
      { symbol: '\\arccos', label: 'arccos' },
      { symbol: '\\arctan', label: 'arctan' },
      { symbol: '\\sinh', label: 'sinh' },
    ],
    algebra: [
      { symbol: '\\frac{}{}', label: 'a/b' },
      { symbol: '\\sqrt{}', label: '√' },
      { symbol: '\\sqrt[n]{}', label: '∛' },
      { symbol: '\\leq', label: '≤' },
      { symbol: '\\geq', label: '≥' },
      { symbol: '\\neq', label: '≠' },
      { symbol: '\\approx', label: '≈' },
      { symbol: '\\in', label: '∈' },
      { symbol: '\\subset', label: '⊂' },
      { symbol: '\\cup', label: '∪' },
    ],
  }

  return (
    <div className="mt-6">
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow`}>
        {/* 标签导航 */}
        <div className={`flex ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {Object.keys(symbolSets).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab 
                  ? `${darkMode ? 'bg-gray-600 text-blue-400' : 'bg-white text-blue-600'} border-b-2 border-blue-500` 
                  : `${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              {tab === 'basic' ? '基础' : 
               tab === 'calculus' ? '微积分' : 
               tab === 'functions' ? '函数' : '代数'}
            </button>
          ))}
        </div>
        
        {/* 符号按钮 */}
        <div className={`grid grid-cols-5 gap-2 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {symbolSets[activeTab].map((item, index) => (
            <button
              key={index}
              onClick={() => onSymbolClick(item.symbol)}
              className={`p-3 rounded-lg text-center font-medium transition-all duration-200 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-sm' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 shadow-sm'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MathKeypad 