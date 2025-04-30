import { useState } from 'react'
import katex from 'katex'

const StepByStepSolution = ({ steps, darkMode }) => {
  const [expandedSteps, setExpandedSteps] = useState(new Set([0])) // 默认展开第一步

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
    <div className="mt-6">
      <div className={`px-4 py-2 ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} rounded-t-lg flex justify-between items-center`}>
        <h4 className="text-lg font-bold">解题步骤</h4>
        <button
          onClick={toggleAll}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-800 text-gray-200' 
              : 'bg-blue-200 hover:bg-blue-300 text-blue-800'
          }`}
        >
          {expandedSteps.size === steps.length ? '折叠全部' : '展开全部'}
        </button>
      </div>
      
      <div className={`rounded-b-lg overflow-hidden shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`border-b ${index === steps.length - 1 ? 'border-b-0' : ''} ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <button
              className={`w-full p-4 text-left font-medium flex items-center transition-colors duration-200 ${
                expandedSteps.has(index)
                  ? (darkMode ? 'bg-gray-600' : 'bg-blue-50') 
                  : (darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-blue-50/50')
              }`}
              onClick={() => toggleStep(index)}
            >
              <div className={`flex-shrink-0 flex items-center justify-center rounded-full mr-3 w-8 h-8 transition-colors duration-200 ${
                expandedSteps.has(index)
                  ? (darkMode ? 'bg-blue-500' : 'bg-blue-500')
                  : (darkMode ? 'bg-gray-700' : 'bg-gray-200')
              } text-white font-bold text-sm`}>
                {index + 1}
              </div>
              
              <span className="flex-1">{step.title}</span>
              
              <span className={`flex-shrink-0 ml-2 transform transition-transform duration-200 ${expandedSteps.has(index) ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSteps.has(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className={`p-5 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                {step.latex && (
                  <div className={`my-4 overflow-x-auto py-4 px-6 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800/50 shadow-inner' 
                      : 'bg-blue-50/50 shadow-inner'
                  }`}>
                    {renderLatex(step.latex)}
                  </div>
                )}
                {step.explanation && (
                  <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {step.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepByStepSolution 