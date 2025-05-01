import { useState } from 'react'
import katex from 'katex'

const StepByStepSolution = ({ steps, darkMode }) => {
  const [expandedSteps, setExpandedSteps] = useState(new Set([0])) // 默认展开第一步
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleStep = (index) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (expandedSteps.size === steps.length) {
      setExpandedSteps(new Set())
    } else {
      setExpandedSteps(new Set(steps.map((_, i) => i)))
    }
  }

  // 使用katex直接渲染LaTeX
  const renderLatex = (latex) => {
    if (!latex) return null;
    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true
      });
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (error) {
      console.error("LaTeX渲染错误:", error);
      return <div className="text-red-500">LaTeX渲染错误: {latex}</div>;
    }
  };

  return (
    <div className={`mt-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      <div 
        className={`p-4 cursor-pointer flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg 
            className={`w-5 h-5 mr-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            详细步骤
          </h3>
        </div>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {isExpanded ? '收起' : '展开'}
        </span>
      </div>
      
      {isExpanded && (
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-4 space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      步骤 {index + 1}
                    </div>
                    <div className="katex-display">
                      {renderLatex(step.latex)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StepByStepSolution 